import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import { schema } from "./schemas";

export function getDb() {
    const sqlite = new Database("sqlite.db");
    return drizzle(sqlite, { schema: schema });
}
