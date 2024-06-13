import { createMockJobToDatabase } from "@/modules/jobs/server/seed";
import { createMockApplicationToDatabase } from "@/modules/applications/server/seed";
import { db } from "./db";
import { schema } from "./db/schema";
import invariant from "tiny-invariant";

const { Jobs, Applications } = schema;

async function seed() {
  const user = await db.query.User.findFirst();
  invariant(user, "User not found");

  await db.delete(Applications);
  await db.delete(Jobs);

  const jobs = await db
    .insert(Jobs)
    .values(repeatCallback(20, createMockJobToDatabase))
    .returning();
  invariant(jobs, "Jobs not found");

  const applications = await db
    .insert(Applications)
    .values(
      repeatDeterministic(20, (index) =>
        createMockApplicationToDatabase({
          userId: user.id,
          jobId: jobs[index].id,
        })
      )
    )
    .returning();
  invariant(applications, "Applications not found");
}

function random<TData>(array: TData[]) {
  invariant(array.length > 0);
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
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
function repeat<TData>(n: number, data: TData) {
  invariant(typeof n === "number" || n >= 0, "n must be a positive number");
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(data);
  }

  return array;
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });
