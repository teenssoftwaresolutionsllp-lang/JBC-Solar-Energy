import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let sqlClient: ReturnType<typeof postgres> | null = null;

export function getRawSql() {
  if (sqlClient) return sqlClient;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  try {
    sqlClient = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
    return sqlClient;
  } catch (err) {
    console.error("Failed to initialize postgres raw client:", err);
    return null;
  }
}

export function getDb() {
  if (dbInstance) return dbInstance;
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn("DATABASE_URL is not set in environment variables. Database operations will fallback to local store.");
    return null;
  }

  try {
    const client = getRawSql();
    if (!client) return null;
    dbInstance = drizzle(client, { schema });
    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize database client:", error);
    return null;
  }
}

export const db = getDb();
export { schema };

