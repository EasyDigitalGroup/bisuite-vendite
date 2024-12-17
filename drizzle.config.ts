import { defineConfig } from "drizzle-kit";

import env from "@/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_PARENT_DB_URL,
    authToken: env.TURSO_GROUP_AUTH_TOKEN,
  },
});
