import { Hono } from "hono";
import { withDB, validate, withKV } from "@/shared/server/middleware";
import { schema, zodSchema } from "@/shared/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protect, withLucia } from "@/shared/auth/server/middleware";
import { HTTPException } from "hono/http-exception";

const { Jobs } = schema;

export const route = new Hono()
  .use(...[withDB, withKV])
  .use(...[withLucia, protect])
  .get("/:id", withDB, async (ctx) => {
    const job = await ctx.var.db.query.Jobs.findFirst({
      where: (Jobs, { eq }) => eq(Jobs.id, ctx.req.param("id")),
    });
    return ctx.json({ data: job });
  })
  .get(
    "/",
    validate(
      "query",
      z.object({
        pageNumber: z.string().default("0"),
        pageSize: z.string().default("10"),
      })
    ),
    async (ctx) => {
      const query = ctx.req.valid("query");
      const pageNumber = Number(query.pageNumber);
      const pageSize = Number(query.pageSize);
      const jobs = await ctx.var.db.query.Jobs.findMany({
        offset: pageNumber * pageSize,
        limit: pageSize,
      });
      return ctx.json({ data: jobs });
    }
  )
  .post("/", validate("json", zodSchema.Jobs.insert), async (ctx) => {
    const input = ctx.req.valid("json");
    const job = await ctx.var.db.insert(Jobs).values(input).returning();

    return ctx.json({ data: job[0] });
  })
  .put("/:id", validate("json", zodSchema.Jobs.insert), async (ctx) => {
    const input = ctx.req.valid("json");
    const job = await ctx.var.db
      .update(Jobs)
      .set(input)
      .where(eq(Jobs.id, ctx.req.param("id")))
      .returning();

    if (!job) {
      throw new HTTPException(400, { message: "Job not found" });
    }

    return ctx.json({ data: job });
  })
  .delete("/:id", async (ctx) => {
    const job = await ctx.var.db
      .delete(Jobs)
      .where(eq(Jobs.id, ctx.req.param("id")))
      .returning();

    if (!job) {
      throw new HTTPException(400, { message: "Job not found" });
    }

    return ctx.json({ data: job });
  });
