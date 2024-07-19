import { Lucia } from "lucia";
import { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { env } from "hono/adapter";
import { Storage } from "unstorage";
import { GitHub, Google } from "arctic";

import type { LibsqlClient } from "@/shared/server/db";
import { UnstorageSessionAdapter, UserAdapter } from "./session-adapter";
import { User } from "lucia";
import { Session } from "lucia";

function initLucia(db: LibsqlClient, kv: Storage) {
  const sessionAdapter = new UnstorageSessionAdapter(kv, new UserAdapter(db));

  const lucia = new Lucia(sessionAdapter, {
    sessionCookie: {
      attributes: {
        secure: process.env.NODE_ENV === "production", // set to `true` when using HTTPS
      },
    },
  });

  return lucia;
}

type LuciaRoot = ReturnType<typeof initLucia>;

export const withLucia: MiddlewareHandler<{
  Variables: {
    kv: Storage;
    db: LibsqlClient;
    lucia: Lucia;
  };
}> = createMiddleware(async (c, next) => {
  c.set("lucia", initLucia(c.var.db, c.var.kv));
  await next();
});

export const withOauth: MiddlewareHandler<{
  Bindings: {
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  };
  Variables: {
    db: LibsqlClient;
    oauth: {
      github: GitHub;
      google: Google;
    };
  };
}> = createMiddleware(async (c, next) => {
  const github = new GitHub(
    env(c).GITHUB_CLIENT_ID,
    env(c).GITHUB_CLIENT_SECRET
  );
  const google = new Google(
    env(c).GOOGLE_CLIENT_ID,
    env(c).GOOGLE_CLIENT_SECRET,
    "/auth/google/callback"
  );
  c.set("oauth", { github, google });
  await next();
});

export const protect = createMiddleware<{
  Variables: {
    lucia: Lucia;
    user: User;
    session: Session;
  };
}>(async (ctx, next) => {
  const sessionId = getCookie(ctx, ctx.var.lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    return new Response(null, {
      status: 403,
      headers: {
        Location: "/",
      },
    });
  }
  const { session, user } = await ctx.var.lucia.validateSession(sessionId);
  if (session && session.fresh) {
    ctx.header(
      "Set-Cookie",
      ctx.var.lucia.createSessionCookie(session.id).serialize(),
      { append: true }
    );
  }
  if (!session) {
    ctx.header(
      "Set-Cookie",
      ctx.var.lucia.createBlankSessionCookie().serialize(),
      { append: true }
    );
  }
  ctx.set("user", user as User);
  ctx.set("session", session as Session);
  await next();
});

declare module "lucia" {
  interface Register {
    Lucia: LuciaRoot;
  }
}
