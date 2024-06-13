import { Hono } from "hono";
import { withDB, withValidation } from "@/shared/server/middleware";
import { schema, zodSchema } from "@/shared/server/db/schema";
import { eq } from "drizzle-orm";

const { Applications } = schema;

const { Jobs } = schema;

export const route = new Hono()
  .get("/:id", withDB, async (ctx) => {
    const result = await ctx.var.db.query.Applications.findFirst({
      where: ({ id }, { eq }) => eq(id, ctx.req.param("id")),
    });
    return ctx.json({ data: result });
  })
  .get("/", withDB, async (ctx) => {
    const result = await ctx.var.db.query.Applications.findMany({
      with: {
        job: true,
      },
    });
    return ctx.json({ data: result });
  })
  .post(
    "/",
    withDB,
    withValidation("json", zodSchema.Applications.insert),
    async (ctx) => {
      const input = ctx.req.valid("json");
      const result = await ctx.var.db.insert(Applications).values(input);

      if (result) {
        return ctx.json({ data: result });
      }
    }
  )
  .put(
    "/:id",
    withDB,
    withValidation("json", zodSchema.Applications.insert),
    async (ctx) => {
      const input = ctx.req.valid("json");
      const result = await ctx.var.db
        .update(Applications)
        .set(input)
        .where(eq(Jobs.id, ctx.req.param("id")))
        .returning();

      if (result) {
        return ctx.json({ data: result });
      }
    }
  )
  .delete("/:id", withDB, async (ctx) => {
    const result = await ctx.var.db
      .delete(Applications)
      .where(eq(Applications.id, ctx.req.param("id")))
      .returning();
    if (result) {
      return ctx.json({ data: result });
    }
  });
