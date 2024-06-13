import { Hono } from "hono";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import { generateState } from "arctic";
import { serializeCookie, parseCookies } from "oslo/cookie";
import { OAuth2RequestError } from "arctic";
import { ulid } from "ulidx";
import { getCookie } from "hono/cookie";

import { log } from "@/shared/server/log";
import { withDB, withKV } from "@/shared/server/middleware";
import { withLucia, withOauth } from "@/shared/auth/server/middleware";

export const route = new Hono()
  .get("/me", withDB, withKV, withLucia, async (c): Promise<Response> => {
    const sessionId = getCookie(c, c.var.lucia.sessionCookieName) ?? null;
    if (!sessionId) {
      throw new HTTPException(403, { message: "Unauthorized" });
    }

    const { session, user } = await c.var.lucia.validateSession(sessionId);
    return new Response(JSON.stringify({ user, session }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  })
  .get("/login/github", withOauth, async (c): Promise<Response> => {
    const {
      oauth: { github },
    } = c.var;
    const state = generateState();
    log.debug("state: ", state);
    const url = await github.createAuthorizationURL(state);
    log.debug("url: ", url.toString());

    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
        "Set-Cookie": serializeCookie("github_oauth_state", state, {
          httpOnly: true,
          secure: env(c).ENV === "PRODUCTION", // set `Secure` flag in HTTPS
          maxAge: 60 * 10, // 10 minutes
          path: "/",
        }),
      },
    });
  })
  .get(
    "/login/github/callback",
    withDB,
    withKV,
    withOauth,
    withLucia,
    async (c): Promise<Response> => {
      // Initialize variables and methods
      const { lucia, db, oauth } = c.var;
      const request = c.req;
      const redirectUrl = `${env(c).BASE_URL}/jobs`;

      // TODO: find a better way to redirect to home page
      async function doesGithubUserExist(id: string) {
        const result = await db.query.Oauth.findFirst({
          where: (oauth, { eq, and }) =>
            and(eq(oauth.providerUserId, id), eq(oauth.providerId, "github")),
        });
        log.debug("doesGithubUserExist: ", result);
        return result;
      }
      async function insertGithubUser(githubResponse: GithubResponse) {
        const userId = ulid();
        await db.transaction(async (tx) => {
          await tx.insert(db.User).values({
            id: userId,
            name: githubResponse.name,
            email: githubResponse.email,
            avatarUrl: githubResponse.avatar_url,
          });
          await tx.insert(db.Oauth).values({
            providerId: "github",
            providerUserId: `${githubResponse.id}`,
            userId,
          });
        });
        log.debug("inserted user: ", userId);
        return userId;
      }

      // Below code follow Web standard so you can copy and paste it to your project
      const cookies = parseCookies(request.raw.headers.get("Cookie") ?? "");
      const stateCookie = cookies.get("github_oauth_state") ?? null;

      const url = new URL(request.url);
      log.debug("url: ", url.toString());
      const state = url.searchParams.get("state");
      log.debug("state: ", state);
      const code = url.searchParams.get("code");
      log.debug("code: ", code);

      // verify state
      if (!state || !stateCookie || !code || stateCookie !== state) {
        log.error("Invalid state");
        log.error({ state, stateCookie, code });

        return new Response(null, {
          status: 400,
        });
      }

      try {
        const tokens = await oauth.github.validateAuthorizationCode(code);
        log.debug("tokens: ", tokens);
        const githubUserResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            "User-Agent": "auth-server",
          },
        });
        const githubUserResult =
          (await githubUserResponse.json()) as GithubResponse;

        log.debug("githubUserResult: ", githubUserResult);
        const existingUser = await doesGithubUserExist(
          `${githubUserResult.id}`
        );
        log.debug("existingUser: ", existingUser);

        if (existingUser) {
          const session = await lucia.createSession(existingUser.userId, {});
          log.debug("session: ", session);
          const sessionCookie = lucia.createSessionCookie(session.id);
          log.debug("sessionCookie: ", sessionCookie);

          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl,
              "Set-Cookie": sessionCookie.serialize(),
            },
          });
        }

        const userId = await insertGithubUser(githubUserResult);
        log.debug("userId: ", userId);
        const session = await lucia.createSession(userId, {});
        log.debug("session: ", session);
        const sessionCookie = lucia.createSessionCookie(session.id);
        log.debug("sessionCookie: ", sessionCookie);
        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectUrl,
            "Set-Cookie": sessionCookie.serialize(),
          },
        });
      } catch (e) {
        log.error(e);
        if (e instanceof OAuth2RequestError) {
          throw new HTTPException(400, {
            cause: e,
            message: e.message,
          });
        }
        throw new HTTPException(500, {
          cause: e,
        });
      }
    }
  );

type GithubResponse = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: Record<string, unknown> | null;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};
