/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(config({
  path: path.resolve(
    process.cwd(),
    ".env",
  ),
}));

const EnvSchema = z.object({
  TURSO_ORG: z.string(),
  TURSO_API_TOKEN: z.string(),
  TURSO_GROUP_AUTH_TOKEN: z.string(),
  TURSO_GROUP_NAME: z.string(),
  TURSO_PARENT_DB_URL: z.string(),
  TURSO_PARENT_DB_NAME: z.string(),
  BISUITE_API_TOKEN: z.string(),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;
