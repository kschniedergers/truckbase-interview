import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const watchlist = sqliteTable("watchlist", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ticker: text("ticker").notNull(),
    addedAt: integer("added_at").notNull(),
    // wouldn't use text for this in a real app but should be fine for now
    lastPrice: text("last_price"),
    lastPriceTime: integer("last_price_time"),
});
