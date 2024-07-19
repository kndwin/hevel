import { User } from "@/shared/auth/server/db";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { ulid } from "ulidx";
import { Applications } from "@/modules/applications/server/db";

export const BaseResumes = sqliteTable("base_resumes", {
  id: text("id")
    .$default(() => `bres_${ulid()}`)
    .primaryKey(),
  userId: text("user_id"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .defaultNow()
    .$onUpdateFn(() => new Date(Date.now()))
    .notNull(),
});

export const TailoredResume = sqliteTable("tailored_resumes", {
  id: text("id")
    .$default(() => `tres_${ulid()}`)
    .primaryKey(),
  userId: text("user_id").references(() => User.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  baseResumeId: text("base_resume_id").references(() => BaseResumes.id),
  applicationId: text("application_id").references(() => Applications.id),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .defaultNow()
    .$onUpdateFn(() => new Date(Date.now()))
    .notNull(),
});

export const BaseResumesRelations = relations(BaseResumes, ({ one }) => ({
  user: one(User, {
    fields: [BaseResumes.userId],
    references: [User.id],
  }),
}));

export const TailoredResumeRelations = relations(TailoredResume, ({ one }) => ({
  tailoredResumes: one(BaseResumes, {
    fields: [TailoredResume.baseResumeId],
    references: [BaseResumes.id],
  }),
  user: one(User, {
    fields: [TailoredResume.userId],
    references: [User.id],
  }),
  application: one(Applications, {
    fields: [TailoredResume.applicationId],
    references: [Applications.id],
  }),
}));
