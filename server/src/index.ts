import express from "express";
import { getDb } from "./db";
import { watchlist } from "./db/schemas/watchlist";
import yahooFinance from "yahoo-finance2";
import { eq } from "drizzle-orm";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
    const s = await yahooFinance.quote("AASSPL");
    console.log(s);
    console.log(s.regularMarketPrice);
    res.send("yo");
});

// app.get("/stock/:ticker", (req, res) => {
//     res.send(`You requested data for ${req.params.ticker}`);
// });

app.get("/watchlist", async (req, res) => {
    const db = getDb();
    const watchlistRes = await db.select().from(watchlist);
    res.send(JSON.stringify(watchlistRes));
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

    const ret = await db.insert(watchlist).values({ addedAt: Date.now(), ticker: req.params.ticker });
    res.send(ret.lastInsertRowid);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
