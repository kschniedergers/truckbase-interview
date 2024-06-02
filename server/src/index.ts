import express from "express";
import { getDb } from "./db";
import { watchlist } from "./db/schemas/watchlist";
import yahooFinance from "yahoo-finance2";
import { eq } from "drizzle-orm";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());

// 30 seconds
const REFRESH_INTERVAL = 30 * 1000;

async function refreshPrices() {
    const db = getDb();
    const watchlistRes = await db.select().from(watchlist);
    watchlistRes.forEach(async (stock) => {
        const s = await yahooFinance.quote(stock.ticker);
        const ret = await db
            .update(watchlist)
            .set({
                lastPrice: s.regularMarketPrice?.toString(),
                lastPriceTime: Date.now(),
            })
            .where(eq(watchlist.ticker, stock.ticker));
    });
}

app.get("/watchlist", async (req, res) => {
    const db = getDb();
    const watchlistRes = await db.select().from(watchlist);
    res.json(watchlistRes);
    return;
});

app.post("/watchlist/:ticker", async (req, res) => {
    const db = getDb();
    const s = await yahooFinance.quote(req.params.ticker);

    if (s === undefined) {
        res.status(404).send("Ticker not found");
        return;
    }

    const dupeCheck = await db.select().from(watchlist).where(eq(watchlist.ticker, req.params.ticker));
    if (dupeCheck.length > 0) {
        res.status(409).send("Ticker already exists in watchlist");
        return;
    }

    const ret = await db.insert(watchlist).values({
        addedAt: Date.now(),
        ticker: req.params.ticker,
        lastPrice: s.regularMarketPrice?.toString(),
        lastPriceTime: Date.now(),
    });
    res.json({ id: ret.lastInsertRowid });
});

setInterval(refreshPrices, REFRESH_INTERVAL);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
