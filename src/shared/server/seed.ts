import invariant from "tiny-invariant";
import { createMockJobToDatabase } from "@/modules/jobs/server/seed";
import { createMockApplicationToDatabase } from "@/modules/applications/server/seed";
import { db } from "./db";
import { Effect } from "effect";
import { schema } from "./db/schema";
import {
  createMockBaseResumeToDatabase,
  createMockTailoredResumeToDatabase,
} from "@/modules/resume/server/seed";

const { Jobs, Applications, KanbanMetadata, BaseResumes, TailoredResume } =
  schema;

class ClearDatabaseError extends Error {}
class NoUserError extends Error {}
class DatabaseError extends Error {}

const seedEffect = Effect.gen(function* () {
  yield* Effect.log("Querying users");
  const users = yield* Effect.tryPromise({
    try: () => db.query.User.findMany(),
    catch: () => new NoUserError(),
  });
  yield* Effect.log(` - ${users.length} users found`);

  yield* Effect.log("Clearing stale database tables...");
  yield* Effect.tryPromise({
    try: async () => {
      await db.delete(Applications);
      await db.delete(Jobs);
      await db.delete(KanbanMetadata);
      await db.delete(TailoredResume);
      await db.delete(BaseResumes);
    },
    catch: () => new ClearDatabaseError(),
  });
  yield* Effect.log(" - Cleared all tables");

  yield* Effect.log("Seeding jobs");
  const jobs = yield* Effect.tryPromise({
    try: async () => {
      return await db
        .insert(Jobs)
        .values(repeatCallback(100, createMockJobToDatabase))
        .returning();
    },
    catch: () => new DatabaseError(),
  });
  yield* Effect.log(` - ${jobs.length} jobs seeded`);

  yield* Effect.log("Seeding applications");
  const NUMBER_OF_APPLICATIONS = 20;
  yield* Effect.forEach(
    users,
    (user) =>
      Effect.gen(function* () {
        yield* Effect.log(` - ${user.id} (${user.name})`);
        yield* Effect.tryPromise({
          try: async () => {
            const baseResumes = await db
              .insert(BaseResumes)
              .values(
                repeatDeterministic(5, () =>
                  createMockBaseResumeToDatabase({
                    userId: user.id,
                  })
                )
              )
              .returning();

            for await (const baseResume of baseResumes) {
              await db.insert(TailoredResume).values(
                repeatDeterministic(5, () =>
                  createMockTailoredResumeToDatabase({
                    baseResumeId: baseResume.id,
                    userId: user.id,
                  })
                )
              );
            }

            const applications = await db
              .insert(Applications)
              .values(
                repeatDeterministic(NUMBER_OF_APPLICATIONS, (index) =>
                  createMockApplicationToDatabase({
                    userId: user.id,
                    jobId: jobs[index].id,
                  })
                )
              )
              .returning();
            const kanbanColumns = getColumns(applications);
            await Promise.all(
              kanbanColumns.map(async (kc) => {
                await db.insert(KanbanMetadata).values({
                  userId: user.id,
                  module: "appications",
                  columnId: kc.id,
                  positionIds: kc.ids,
                });
              })
            );
          },
          catch: (error) => {
            throw new Error(error);
          },
        });
      }),
    { concurrency: 2 }
  );
});

function getColumns(
  apps: {
    id: string;
    status: string;
    updatedAt: Date | null;
    userId: string;
    jobId: string;
    sentiment: string | null;
    appliedAt: Date | null;
  }[]
) {
  const initalColumns: { id: string; ids: string[] }[] = [
    { ids: [], id: "not-started" },
    { ids: [], id: "applied" },
    { ids: [], id: "interview" },
    { ids: [], id: "rejected" },
    { ids: [], id: "interviewing" },
    { ids: [], id: "expired" },
  ];

  apps.forEach((app) => {
    const colIdx = initalColumns.findIndex((c) => c.id == app.status);
    initalColumns[colIdx].ids.push(app.id);
  });

  return initalColumns;
}

function repeatDeterministic<TData>(n: number, data: (index: number) => TData) {
  invariant(typeof n === "number" || n >= 0, "n must be a positive number");

  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(data(i));
  }

  return array;
}
function repeatCallback<TData>(n: number, callback: () => TData) {
  invariant(typeof n === "number" || n >= 0, "n must be a positive number");
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(callback());
  }

  return array;
}

Effect.runPromise(seedEffect);
