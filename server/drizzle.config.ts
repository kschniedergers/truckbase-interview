import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/db/schemas",
    out: "./drizzle",
    dbCredentials: {
        url: "./sqlite.db",
    },
});
