import { defineConfig } from "drizzle-kit";

import env from "@/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_PARENT_DB_URL,
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzQ0NDkzOTksImlkIjoiMDM1NzBhMDgtNzNhMi00Y2MxLThlMzgtMTYyYmM2OWEyOTYwIn0.WUpFlE0DsYMFCigiaA0HB_pVDh24M364Ku8cALATI3nnWe4wQB4gr2VeniA4n0O1JPyjsI6moCaAlXyuHlWVBQ",
  },
});
