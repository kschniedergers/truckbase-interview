import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "./consts";
import axios from "axios";

const REFETCH_INTERVAL = 5 * 1000;

function App() {
    const [inputValue, setInputValue] = useState("");

    const getWatchlistQuery = useQuery({
        queryKey: ["watchlist"],
        queryFn: async () => {
            const res = await axios.get(BACKEND_URL + "/watchlist");
            return res.data as {
                id: number;
                ticker: string;
                addedAt: number;
                lastPrice: string | null;
                lastPriceTime: number | null;
            }[];
        },
        refetchInterval: REFETCH_INTERVAL,
    });

    const addStockMutation = useMutation({
        mutationFn: (ticker: string) => axios.post(BACKEND_URL + `/watchlist/${ticker}`),
    });

    const handleSubmit = () => {
        console.log(inputValue);
        addStockMutation.mutate(inputValue, {
            onSuccess: () => {
                setInputValue("");
                getWatchlistQuery.refetch();
            },
        });
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
                {addStockMutation.isSuccess && !addStockMutation.isError && <p>Added stock to watchlist!</p>}
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xl">Watchlist:</p>
                {getWatchlistQuery.isLoading && <p>Loading...</p>}
                {getWatchlistQuery.isError && <p className="text-red-600">Error: {getWatchlistQuery.error.message}</p>}
                {getWatchlistQuery.data && (
                    // basic table for stock data with left aligned headers and lines between all boxes
                    <table className="border-collapse border border-black">
                        <thead>
                            <tr>
                                <th className="border border-black">Ticker</th>
                                <th className="border border-black">Added At</th>
                                <th className="border border-black">Last Price</th>
                                <th className="border border-black">Last Price Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getWatchlistQuery.data.map((stock) => (
                                <tr key={stock.id}>
                                    <td className="border border-black">{stock.ticker}</td>
                                    <td className="border border-black">
                                        {stock.addedAt ? new Date(stock.addedAt).toLocaleString() : "N/A"}
                                    </td>
                                    <td className="border border-black">{stock.lastPrice || "N/A"}</td>
                                    <td className="border border-black">
                                        {stock.lastPriceTime ? new Date(stock.lastPriceTime).toLocaleString() : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default App;
