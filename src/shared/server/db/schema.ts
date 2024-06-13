import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Jobs } from "@/modules/jobs/server/db";
import {
  Applications,
  ApplicationsRelations,
} from "@/modules/applications/server/db";
import { Oauth, OauthRelations, User } from "@/shared/auth/server/db";

export const schema = {
  Jobs,
  Applications,
  Oauth,
  User,
  OauthRelations,
  ApplicationsRelations,
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
};
