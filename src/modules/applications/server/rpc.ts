import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { log } from "@/shared/server/log";
import { withDB, validate, withKV } from "@/shared/server/middleware";
import { schema, zodSchema } from "@/shared/server/db/schema";
import { protect, withLucia } from "@/shared/auth/server/middleware";

const { Applications, KanbanMetadata } = schema;

export const route = new Hono()
  .use(...[withDB, withKV])
  .use(...[withLucia, protect])
  .get("/kanban-metadata", async (ctx) => {
    const result = await ctx.var.db.query.KanbanMetadata.findMany({
      where: and(
        eq(KanbanMetadata.module, "appications"),
        eq(KanbanMetadata.userId, ctx.var.user.id)
      ),
    });
    return ctx.json({ data: result });
  })
  .patch(
    "/kanban-metadata/:id/move-position",
    validate(
      "json",
      z.object({
        columnId: z.string(),
        toCardId: z.string(),
        edge: z.enum(["top", "bottom"]),
      })
    ),
    async (ctx) => {
      const { columnId, toCardId, edge } = ctx.req.valid("json");
      const fromCardId = ctx.req.param("id");

      function condition(columnId: string) {
        return and(
          eq(KanbanMetadata.module, "appications"),
          eq(KanbanMetadata.columnId, columnId),
          eq(KanbanMetadata.userId, ctx.var.user.id)
        );
      }

      const column = await ctx.var.db.query.KanbanMetadata.findFirst({
        where: condition(columnId),
      });

      if (!column) {
        throw new HTTPException(404, { message: "No column" });
      }

      function wrapIndex(
        index: number,
        edge: "top" | "bottom",
        length: number
      ) {
        if (length === 0) return 0;
        if (edge === "top" && index === 0) return 0;
        if (edge === "bottom" && index === length - 1) return length - 1;
        if (edge === "top") return index;
        if (edge === "bottom") return index + 1;
        return 0;
      }

      const toCardIndex = column.positionIds.findIndex(
        (pid) => pid === toCardId
      );
      const newIndex = wrapIndex(toCardIndex, edge, column.positionIds.length);

      const newPositionIds = column.positionIds.filter(
        (pid) => pid !== fromCardId
      );
      newPositionIds.splice(newIndex, 0, fromCardId);

      await ctx.var.db
        .update(KanbanMetadata)
        .set({ positionIds: newPositionIds })
        .where(condition(columnId));

      return ctx.json({ status: "success" });
    }
  )
  .patch(
    "/kanban-metadata/:id/move-column",
    validate(
      "json",
      z.object({
        fromColumnId: z.string(),
        toColumnId: z.string(),
      })
    ),
    async (ctx) => {
      const { fromColumnId, toColumnId } = ctx.req.valid("json");
      const id = ctx.req.param("id");

      function condition(status: string) {
        return and(
          eq(KanbanMetadata.module, "appications"),
          eq(KanbanMetadata.columnId, status),
          eq(KanbanMetadata.userId, ctx.var.user.id)
        );
      }

      if (fromColumnId === toColumnId) {
        throw new HTTPException(400, { message: "same column" });
      }
      const prevColumn = await ctx.var.db.query.KanbanMetadata.findFirst({
        where: condition(fromColumnId),
      });

      if (!prevColumn) {
        throw new HTTPException(404, {
          message: `column ${fromColumnId} not found in metadata`,
        });
      }
      await ctx.var.db
        .update(KanbanMetadata)
        .set({
          positionIds: prevColumn.positionIds.filter((_id) => _id !== id),
        })
        .where(condition(fromColumnId));

      const newColumn = await ctx.var.db.query.KanbanMetadata.findFirst({
        where: condition(toColumnId),
      });

      if (!newColumn) {
        throw new HTTPException(404, {
          message: `column ${toColumnId} not found in metadata`,
        });
      }

      await ctx.var.db
        .update(KanbanMetadata)
        .set({
          positionIds: [...newColumn.positionIds, id],
        })
        .where(condition(toColumnId));

      return ctx.json({ status: "success" });
    }
  )
  .get(
    "/",
    validate(
      "query",
      z.object({
        dateRangeStart: z.string().datetime(),
        dateRangeEnd: z.string().datetime(),
      })
    ),
    async (ctx) => {
      const query = ctx.req.valid("query");
      const result = await ctx.var.db.query.Applications.findMany({
        with: { job: true },
        where: (application, { between }) => {
          return between(
            application.appliedAt,
            new Date(query.dateRangeStart),
            new Date(query.dateRangeEnd)
          );
        },
      });

      return ctx.json({ data: result });
    }
  )
  .post("/", validate("json", zodSchema.Applications.insert), async (ctx) => {
    const input = ctx.req.valid("json");
    const result = (
      await ctx.var.db.insert(Applications).values(input).returning()
    )[0];

    await ctx.var.db.transaction(async (tx) => {
      const application = result;

      function condition(status: string) {
        return and(
          eq(KanbanMetadata.module, "appications"),
          eq(KanbanMetadata.columnId, status),
          eq(KanbanMetadata.userId, ctx.var.user.id)
        );
      }

      const exist = await tx.query.KanbanMetadata.findFirst({
        where: condition(application.status),
      });

      if (!exist) {
        await tx.insert(KanbanMetadata).values({
          userId: application.userId,
          module: "appications",
          columnId: application.status,
          positionIds: [application.id],
        });
      } else {
        await tx
          .update(KanbanMetadata)
          .set({
            positionIds: [...exist.positionIds, application.id],
          })
          .where(condition(application.status))
          .returning();
      }
    });

    if (result) {
      return ctx.json({ data: result });
    }
  })
  .use("/:id", async (ctx, next) => {
    const result = await ctx.var.db.query.Applications.findFirst({
      where: ({ id }, { eq }) => eq(id, ctx.req.param("id")),
    });

    if (!result) {
      throw new HTTPException(400, { message: "Applications not found" });
    }
    await next();
  })
  .get("/:id", async (ctx) => {
    const result = await ctx.var.db.query.Applications.findFirst({
      where: ({ id }, { eq }) => eq(id, ctx.req.param("id")),
    });

    return ctx.json({ data: result });
  })
  .patch(
    "/:id",
    validate("json", zodSchema.Applications.insert.partial()),
    async (ctx) => {
      const input = ctx.req.valid("json");
      const id = ctx.req.param("id");

      const current = (
        await ctx.var.db
          .update(Applications)
          .set(input)
          .where(eq(Applications.id, id))
          .returning()
      )[0];

      log.info("current appplication: ", current);
      return ctx.json({ data: current });
    }
  )
  .put("/:id", validate("json", zodSchema.Applications.insert), async (ctx) => {
    const input = ctx.req.valid("json");
    const result = await ctx.var.db
      .update(Applications)
      .set(input)
      .where(eq(Applications.id, ctx.req.param("id")))
      .returning();

    return ctx.json({ data: result });
  })
  .delete("/:id", async (ctx) => {
    const result = await ctx.var.db
      .delete(Applications)
      .where(eq(Applications.id, ctx.req.param("id")))
      .returning();

    return ctx.json({ data: result });
  });
