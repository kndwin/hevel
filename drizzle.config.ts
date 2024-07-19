import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: ["./src/shared/server/db/schema.ts"],
  out: "./src/shared/server/db/migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string,
  },
  verbose: true,
});
