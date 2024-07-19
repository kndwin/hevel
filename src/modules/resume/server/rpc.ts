import { Hono } from "hono";
import { withDB, validate, withKV } from "@/shared/server/middleware";
import { schema, zodSchema } from "@/shared/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protect, withLucia } from "@/shared/auth/server/middleware";
import { HTTPException } from "hono/http-exception";

const { BaseResumes } = schema;

export const route = new Hono()
  .use(...[withDB, withKV])
  .use(...[withLucia, protect])
  .get(
    "/base",
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
      const baseResumes = await ctx.var.db.query.BaseResumes.findMany({
        offset: pageNumber * pageSize,
        limit: pageSize,
        where: eq(BaseResumes.userId, ctx.var.user.id),
      });
      return ctx.json({ data: baseResumes });
    }
  )
  .get(
    "/tailored",
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
      const baseResumes = await ctx.var.db.query.TailoredResume.findMany({
        offset: pageNumber * pageSize,
        limit: pageSize,
        where: eq(BaseResumes.userId, ctx.var.user.id),
      });
      return ctx.json({ data: baseResumes });
    }
  );
