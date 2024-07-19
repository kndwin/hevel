import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { relations, schema } from "./schema";

const libsqlClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const drizzleClient = drizzle(libsqlClient, {
  schema: { ...schema, ...relations },
});

export const db = Object.assign(drizzleClient, { ...schema });

export type LibsqlClient = typeof drizzleClient;
