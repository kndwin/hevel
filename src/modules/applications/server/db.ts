import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { ulid } from "ulidx";

import { User } from "@/shared/auth/server/db";
import { Jobs } from "@/modules/jobs/server/db";
import { relations } from "drizzle-orm";

export const Applications = sqliteTable("applications", {
  id: text("id")
    .$default(() => ulid())
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => User.id),
  jobId: text("job_id")
    .notNull()
    .references(() => Jobs.id),
  status: text("status").notNull().default("not-started"),
  sentiment: text("sentiment"),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .defaultNow()
    .$onUpdateFn(() => new Date(Date.now())),
  appliedAt: integer("applied_at", { mode: "timestamp_ms" })
    .defaultNow()
    .$onUpdateFn(() => new Date(Date.now())),
});

export const ApplicationsRelations = relations(Applications, ({ one }) => ({
  job: one(Jobs, {
    fields: [Applications.jobId],
    references: [Jobs.id],
  }),
  user: one(User, {
    fields: [Applications.userId],
    references: [User.id],
  }),
}));
