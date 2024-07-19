import type { MiddlewareHandler } from "hono";
import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { schema, relations } from "./schema";

function getDB(env: { url: string; authToken: string }) {
  return Object.assign(
    drizzle(createClient(env), { schema: { ...schema, ...relations } }),
    { ...schema }
  );
}

export const withDB: MiddlewareHandler<{
  Bindings: {
    DATABASE_URL: string;
    DATABASE_AUTH_TOKEN: string;
  };
  Variables: {
    db: ReturnType<typeof getDB>;
  };
}> = createMiddleware(async (c, next) => {
  c.set(
    "db",
    getDB({
      url: env(c).DATABASE_URL,
      authToken: env(c).DATABASE_AUTH_TOKEN,
    })
  );

  await next();
});
