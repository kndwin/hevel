import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { ulid } from "ulidx";

export const Jobs = sqliteTable("jobs", {
  id: text("id")
    .$default(() => ulid())
    .primaryKey(),
  title: text("title").notNull(),
  descriptionInHTML: text("description_in_html").notNull(),
  company: text("company").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  location: text("location").notNull(),
  salary: integer("salary"),
  techStack: text("tech_stack").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .defaultNow()
    .$onUpdateFn(() => new Date(Date.now())),
});
