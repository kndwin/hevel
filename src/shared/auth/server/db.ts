import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { ulid } from "ulidx";

export const Oauth = sqliteTable(
  "oauth_accounts",
  {
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => User.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.providerId, table.userId] }),
  })
);

export const OauthRelations = relations(Oauth, ({ one }) => ({
  user: one(User, {
    fields: [Oauth.userId],
    references: [User.id],
  }),
}));

export const User = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => `user_${ulid()}`),
  name: text("name").notNull(),
  email: text("email"),
  avatarUrl: text("avatar_url").notNull(),
});
