import { Hono } from "hono";
import { withDB, withValidation } from "@/shared/server/middleware";
import { schema, zodSchema } from "@/shared/server/db/schema";
import { eq } from "drizzle-orm";

const { Jobs } = schema;

export const route = new Hono()
  .get("/:id", withDB, async (ctx) => {
    const job = await ctx.var.db.query.Jobs.findFirst({
      where: (Jobs, { eq }) => eq(Jobs.id, ctx.req.param("id")),
    });
    return ctx.json({
      data: job,
    });
  })
  .get("/", withDB, async (ctx) => {
    const jobs = await ctx.var.db.query.Jobs.findMany();
    return ctx.json({
      data: jobs,
    });
  })
  .post(
    "/",
    withDB,
    withValidation("json", zodSchema.Jobs.insert),
    async (ctx) => {
      const input = ctx.req.valid("json");
      const job = await ctx.var.db.insert(Jobs).values(input).returning();

      return ctx.json({ data: job[0] });
    }
  )
  .put(
    "/:id",
    withDB,
    withValidation("json", zodSchema.Jobs.insert),
    async (ctx) => {
      const input = ctx.req.valid("json");
      const job = await ctx.var.db
        .update(Jobs)
        .set(input)
        .where(eq(Jobs.id, ctx.req.param("id")))
        .returning();
      console.log({ job });
      if (job) {
        return ctx.json({
          data: job,
        });
      }
    }
  )
  .delete("/:id", withDB, async (ctx) => {
    const job = await ctx.var.db
      .delete(Jobs)
      .where(eq(Jobs.id, ctx.req.param("id")))
      .returning();
    if (job) {
      return ctx.json({
        data: job,
      });
    }
  });
