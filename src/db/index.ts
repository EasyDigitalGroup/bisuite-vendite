import { createClient as createLibsqlClient } from "@libsql/client";
import { createClient as createTursoClient } from "@tursodatabase/api";
import { drizzle } from "drizzle-orm/libsql";
import md5 from "md5";

import env from "@/env";

import * as schema from "./schema";

const turso = createTursoClient({
  org: env.TURSO_ORG,
  token: env.TURSO_API_TOKEN,
});

export async function createDatabase(idIstanza: string) {
  const dbName = hashDatabaseName(idIstanza);
  try {
    const db = await turso.databases.create(dbName, {
      schema: env.TURSO_PARENT_DB_NAME,
      group: env.TURSO_GROUP_NAME,
    });
    return db;
  }
  catch (error: any) {
    console.log(error);
    console.error("Error creating database: ", idIstanza);
    return null;
  }
}

export async function checkDatabaseExists(idIstanza: string): Promise<boolean> {
  const dbName = hashDatabaseName(idIstanza);
  if (!dbName)
    return false;

  try {
    const db = await turso.databases.get(dbName);
    if (!db)
      return false;
    return true;
  }
  catch (error) {
    return false;
  }
}

export async function getDatabaseClient(idIstanza: string) {
  const url = getLibsqlUrl(idIstanza);

  try {
    const client = createLibsqlClient({
      url,
      authToken: env.TURSO_GROUP_AUTH_TOKEN,
    });

    return drizzle(client, { schema });
  }
  catch (error) {
    console.error("Failed to create database client:", error);
    return null;
  }
}

export function hashDatabaseName(idIstanza: string) {
  return md5(idIstanza);
}

function getLibsqlUrl(idIstanza: string): string {
  const dbName = hashDatabaseName(idIstanza);
  return `libsql://${dbName}-${env.TURSO_ORG}.turso.io`;
}
