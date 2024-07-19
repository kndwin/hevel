import { Hono } from "hono";
import { logger } from "hono/logger";
import { showRoutes } from "hono/dev";

import * as jobs from "@/modules/jobs/server/rpc";
import * as resumes from "@/modules/resume/server/rpc";
import * as applications from "@/modules/applications/server/rpc";
import * as auth from "@/shared/auth/server/rpc";
import { log } from "@/shared/server/log";
import { withKV } from "@/shared/server/kv/middleware";

const app = new Hono()
  .use(logger())
  .get("/healthcheck", withKV, async (c) => {
    log.info("KV TEST");
    let kvTest = await c.var.kv.getItem("test");
    log.info("> initial fetch: ", kvTest);
    await c.var.kv.setItem("test", "test-value");
    kvTest = await c.var.kv.getItem("test");
    log.info("> fetch after setting: ", kvTest);
    await c.var.kv.removeItem("test");
    kvTest = await c.var.kv.getItem("test");
    log.info("> fetch after removing: ", kvTest);

    log.info("LOGGING LEVELS");
    log.info(log.levelVal);
    log.trace("> trace");
    log.debug("> debug");
    log.info("> info");
    log.warn("> warn");
    log.error("> error");
    log.fatal("> fatal");
    return c.json({ status: "success" });
  })
  .route("/jobs", jobs.route)
  .route("/resumes", resumes.route)
  .route("/applications", applications.route)
  .route("/auth", auth.route);

log.info(showRoutes(app));

export type AppType = typeof app;

export default app;
