"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, pieArcClasses } from "@mui/x-charts/PieChart";
import { Loader2, Trash2 } from "lucide-react";

export default function Statistic() {
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [numOfRecords, setNumOfRecords] = useState(0);
    const [latestRecord, setLatestRecord] = useState(["", "", "", "", ""]);
    const [totals, setTotals] = useState({
        charityATotal: 0,
        charityBTotal: 0,
        charityCTotal: 0,
        charityDTotal: 0,
    });
    const [sortDirection, setSortDirection] = useState("desc");

    const fetchDonations = async (page = 1, sortDirection = "desc") => {
        try {
            const res = await fetch(
                `/api/sheets?page=${page}&sortDirection=${sortDirection}`
            );
            const data = await res.json();
            setNumPages(data.numPages);
            setNumOfRecords(data.numOfRecords);
            setLatestRecord(data.latestRecord);
            setTotals(data.totals);
            if (sortDirection === "desc") return data.data.reverse();
            return data.data;
        } catch (err) {
            console.error(err);
        }
    };

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["donations", page, sortDirection],
        queryFn: () => fetchDonations(page, sortDirection),
        refetchInterval: 10000,
    });

    return (
        <>
            {isPending && (
                <div className="w-full h-screen grid place-content-center">
                    <Loader2 className="animate-spin w-16 h-16" />
                </div>
            )}
            {isError && <div>{error.message}</div>}
            {!isPending && !isError && data && (
                <div className="w-full p-4 flex flex-col items-center justify-between">
                    {latestRecord && (
                        <div className="flex gap-2 flex-wrap items-center justify-center mb-4">
                            <h2 className="font-semibold">LATEST DONATION:</h2>
                            <p>
                                <span className="font-semibold">A:</span>{" "}
                                {latestRecord[0]} Ft
                            </p>
                            <p>
                                <span className="font-semibold">B:</span>{" "}
                                {latestRecord[1]} Ft
                            </p>
                            <p>
                                <span className="font-semibold">C:</span>{" "}
                                {latestRecord[2]} Ft
                            </p>
                            <p>
                                <span className="font-semibold">D:</span>{" "}
                                {latestRecord[3]} Ft
                            </p>
                            <p>
                                <span className="font-semibold">IP:</span>{" "}
                                {latestRecord[4]}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    CREATED AT:
                                </span>{" "}
                                {latestRecord[5]}
                            </p>
                            <hr />
                        </div>
                    )}
                    <h1 className="font-semibold">
                        NUMBER OF RECORD:{" "}
                        <span className="font-medium">{numOfRecords}</span>
                    </h1>
                    <div className="mt-4">
                        <PieChart
                            series={[
                                {
                                    data: [
                                        {
                                            id: 0,
                                            value: totals.charityATotal,
                                            label: `A: ${(
                                                (totals.charityATotal /
                                                    (numOfRecords *
                                                        3_000_000)) *
                                                100
                                            ).toFixed(2)}%`,
                                        },
                                        {
                                            id: 1,
                                            value: totals.charityBTotal,
                                            label: `B: ${(
                                                (totals.charityBTotal /
                                                    (numOfRecords *
                                                        3_000_000)) *
                                                100
                                            ).toFixed(2)}%`,
                                        },
                                        {
                                            id: 2,
                                            value: totals.charityCTotal,
                                            label: `C: ${(
                                                (totals.charityCTotal /
                                                    (numOfRecords *
                                                        3_000_000)) *
                                                100
                                            ).toFixed(2)}%`,
                                        },
                                        {
                                            id: 3,
                                            value: totals.charityDTotal,
                                            label: `D: ${(
                                                (totals.charityDTotal /
                                                    (numOfRecords *
                                                        3_000_000)) *
                                                100
                                            ).toFixed(2)}%`,
                                        },
                                    ],
                                    highlightScope: {
                                        faded: "global",
                                        highlighted: "item",
                                    },
                                    faded: {
                                        innerRadius: 30,
                                        additionalRadius: -30,
                                    },
                                },
                            ]}
                            width={400}
                            height={200}
                            sx={{
                                [`& .${pieArcClasses.faded}`]: {
                                    fill: "gray",
                                },
                            }}
                        />
                    </div>
                    <hr />
                    <div className="flex gap-2">
                        <p className="font-bold">
                            Total number of donations per charity:
                        </p>
                        <p>A: {totals.charityATotal}</p>
                        <p>B: {totals.charityBTotal}</p>
                        <p>C: {totals.charityCTotal}</p>
                        <p>D: {totals.charityDTotal}</p>
                    </div>
                    <label htmlFor="sort" className="mt-6">
                        Sort by date:
                    </label>
                    <select
                        className="mb-6"
                        name="sort"
                        id="sort"
                        onChange={(e) => {
                            if (e.target.value === "asc")
                                setSortDirection("asc");
                            if (e.target.value === "desc")
                                setSortDirection("desc");
                        }}
                        value={sortDirection}
                    >
                        <option value="asc">ASCENDING</option>
                        <option value="desc">DESCENDING</option>
                    </select>
                    <table className="w-full md:w-3/4 text-center">
                        <thead>
                            <tr>
                                <th>A</th>
                                <th>B</th>
                                <th>C</th>
                                <th>D</th>
                                <th>IP</th>
                                <th>CREATED AT</th>
                                <th>X</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item: any, index: number) => {
                                if (item.length === 0) return null;
                                return (
                                    <tr key={index}>
                                        {item.map((row: any, idx: number) => {
                                            return <td key={idx}>{row}</td>;
                                        })}
                                        <td>
                                            <button
                                                onClick={async () => {
                                                    let rowNumber;
                                                    if (
                                                        sortDirection === "desc"
                                                    ) {
                                                        rowNumber =
                                                            page === 1
                                                                ? numOfRecords -
                                                                  index +
                                                                  1
                                                                : numOfRecords -
                                                                  page * 10 +
                                                                  (10 - index) +
                                                                  1;
                                                    } else {
                                                        rowNumber =
                                                            page === 1
                                                                ? index + 2
                                                                : page * 10 -
                                                                  10 +
                                                                  index +
                                                                  2;
                                                    }
                                                    try {
                                                        const res = await fetch(
                                                            "/api/delete",
                                                            {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type":
                                                                        "application/json",
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        rowNumber,
                                                                    }
                                                                ),
                                                            }
                                                        );
                                                        const data =
                                                            await res.json();
                                                        console.log(data);
                                                    } catch (err) {
                                                        console.log(err);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {numPages > 1 && (
                        <div className="w-full flex flex-col items-center justify-center gap-2 mt-8">
                            <div className="flex gap-2">
                                {Array.from({ length: numPages }).map(
                                    (_, idx) => {
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setPage(idx + 1)}
                                                style={
                                                    page === idx + 1
                                                        ? {
                                                              fontWeight:
                                                                  "bold",
                                                              borderBottom:
                                                                  "1px solid black",
                                                          }
                                                        : {}
                                                }
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
