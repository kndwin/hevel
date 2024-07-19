import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Jobs } from "@/modules/jobs/server/db";
import {
  Applications,
  ApplicationsRelations,
  KanbanMetadata,
} from "@/modules/applications/server/db";
import { Oauth, OauthRelations, User } from "@/shared/auth/server/db";
import {
  BaseResumes,
  BaseResumesRelations,
  TailoredResume,
  TailoredResumeRelations,
} from "@/modules/resume/server/db";

export const schema = {
  Jobs,
  Applications,
  Oauth,
  User,
  KanbanMetadata,
  TailoredResume,
  BaseResumes,
};

export const relations = {
  OauthRelations,
  ApplicationsRelations,
  BaseResumesRelations,
  TailoredResumeRelations,
};

export const zodSchema = {
  Jobs: {
    insert: createInsertSchema(Jobs),
    select: createSelectSchema(Jobs),
  },
  User: {
    insert: createInsertSchema(User),
    select: createSelectSchema(User),
  },
  Oauth: {
    insert: createInsertSchema(Oauth),
    select: createSelectSchema(Oauth),
  },
  Applications: {
    insert: createInsertSchema(Applications),
    select: createSelectSchema(Applications),
  },
  KanbanMetadata: {
    insert: createInsertSchema(KanbanMetadata),
    select: createSelectSchema(KanbanMetadata),
  },
  TailoredResume: {
    insert: createInsertSchema(TailoredResume),
    select: createSelectSchema(TailoredResume),
  },
  BaseResumes: {
    insert: createInsertSchema(BaseResumes),
    select: createSelectSchema(BaseResumes),
  },
};

export {
  Jobs,
  Applications,
  Oauth,
  User,
  OauthRelations,
  ApplicationsRelations,
  KanbanMetadata,
  TailoredResume,
  BaseResumes,
};
