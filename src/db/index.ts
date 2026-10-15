import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  if (!connectionString) {
    console.warn("DATABASE_URL is not set in environment variables. Database operations will be mocked or throw if invoked without connection.");
    return null;
  }

  try {
    const client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
    dbInstance = drizzle(client, { schema });
    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize database client:", error);
    return null;
  }
}

export const db = getDb();
export { schema };
