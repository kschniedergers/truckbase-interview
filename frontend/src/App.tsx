import React, { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "./consts";

function App() {
    const [inputValue, setInputValue] = useState("");

    const getWatchlistQuery = useQuery({
        queryKey: ["watchlist"],
        queryFn: () =>
            fetch(BACKEND_URL + "/watchlist").then(
                (res) =>
                    res.json() as Promise<
                        // copied from server/src/index.ts
                        {
                            id: number;
                            ticker: string;
                            addedAt: number;
                        }[]
                    >
            ),
        // uncomment for simple polling based updates
        // refetchInterval: 1000,
    });

    const addStockMutation = useMutation({
        mutationFn: (ticker: string) => fetch(BACKEND_URL + `/watchlist/${ticker}`),
    });

    const handleSubmit = () => {
        console.log(inputValue);
        addStockMutation.mutate(inputValue, { onSuccess: () => setInputValue("") });
    };

    return (
        <div className="flex flex-col gap-8 p-4">
            <p className="text-5xl">Stock Tracker</p>
            <div className="flex flex-col gap-2">
                <p className="text-xl">Add stock:</p>
                <div>
                    <input
                        className="border-2"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button className="ml-4 px-1 bg-gray-200" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                {addStockMutation.isPending && <p>Submitting...</p>}
                {addStockMutation.isError && <p className="text-red-600">Error: {addStockMutation.error.message}</p>}
                {addStockMutation.isSuccess && <p>Added stock to watchlist!</p>}
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xl">Watchlist:</p>
                {getWatchlistQuery.isLoading && <p>Loading...</p>}
                {getWatchlistQuery.isError && <p className="text-red-600">Error: {getWatchlistQuery.error.message}</p>}
                {getWatchlistQuery.data && (
                    <ul>
                        {getWatchlistQuery.data.map((stock) => (
                            <li key={stock.id}>
                                {stock.ticker} - {new Date(stock.addedAt).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;
