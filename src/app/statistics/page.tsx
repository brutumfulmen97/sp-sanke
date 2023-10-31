"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PieChart from "@/components/PieChart";
import LatestRecord from "@/components/LatestRecord";
import toast, { Toaster } from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

type FetchedData = {
    data: string[][];
    numPages: number;
    numOfRecords: number;
    latestRecord: string[];
    totals: Record<string, number>;
};

export default function Statistic() {
    const [page, setPage] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);
    const [numOfRecords, setNumOfRecords] = useState<number>(0);
    const [latestRecord, setLatestRecord] = useState<string[]>([
        "",
        "",
        "",
        "",
        "",
    ]);
    const [totals, setTotals] = useState<Record<string, number>>({
        charityATotal: 0,
        charityBTotal: 0,
        charityCTotal: 0,
        charityDTotal: 0,
    });
    const [sortDirection, setSortDirection] = useState<string>("desc");

    const fetchDonations = async (page = 1, sortDirection = "desc") => {
        try {
            const res = await fetch(
                `/api/sheets?page=${page}&sortDirection=${sortDirection}`
            );
            const data: FetchedData = await res.json();
            if (!res.ok) throw new Error("Something went wrong");
            setNumPages(data.numPages);
            setNumOfRecords(data.numOfRecords);
            setLatestRecord(data.latestRecord);
            setTotals(data.totals);
            if (sortDirection === "desc") return data.data.reverse();
            return data.data;
        } catch (err: any) {
            toast.error(err.message);
            console.error(err);
        }
    };

    const { isPending, isError, data, error, refetch } = useQuery({
        queryKey: ["donations", page, sortDirection],
        queryFn: () => fetchDonations(page, sortDirection),
    });

    const handleDelete = async (index: number) => {
        let rowNumber;
        if (sortDirection === "desc") {
            rowNumber =
                page === 1
                    ? numOfRecords - index + 1
                    : numOfRecords - page * 10 + (10 - index) + 1;
        } else {
            rowNumber = page === 1 ? index + 2 : page * 10 - 10 + index + 2;
        }
        try {
            const res = await fetch("/api/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rowNumber,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success("Successfully deleted");
            refetch();
        } catch (err: any) {
            toast.error(err.message);
            console.log(err);
        }
    };

    const queryClient = useQueryClient();

    const {
        isPending: isDeleting,
        mutate: deleteRecord,
        variables,
        isError: isDeleteError,
    } = useMutation({
        mutationFn: handleDelete,
        onSettled: async () => {
            return await queryClient.invalidateQueries({
                queryKey: ["donations"],
            });
        },
    });

    const percents = {
        charityA: (
            (totals.charityATotal / (numOfRecords * 3_000_000)) *
            100
        ).toFixed(2),
        charityB: (
            (totals.charityBTotal / (numOfRecords * 3_000_000)) *
            100
        ).toFixed(2),
        charityC: (
            (totals.charityCTotal / (numOfRecords * 3_000_000)) *
            100
        ).toFixed(2),
        charityD: (
            (totals.charityDTotal / (numOfRecords * 3_000_000)) *
            100
        ).toFixed(2),
    };

    return (
        <>
            <Toaster />
            {isPending && (
                <div className="w-full h-screen grid place-content-center">
                    <Loader2 className="animate-spin w-16 h-16" />
                </div>
            )}
            {isError && <div>{error.message}</div>}
            {!isPending && !isError && data?.length === 0 && (
                <div>No data yet</div>
            )}
            {!isPending && !isError && data && (
                <div className="w-full p-4 flex flex-col items-center justify-between text-xs md:text-md">
                    {latestRecord && (
                        <LatestRecord latestRecord={latestRecord} />
                    )}
                    <h1 className="font-semibold">
                        NUMBER OF RECORD:{" "}
                        <span className="font-medium">{numOfRecords}</span>
                    </h1>
                    <div className="mt-4">
                        <PieChart percents={percents} totals={totals} />
                    </div>
                    <hr />
                    <div className="mt-6 flex gap-2">
                        <p className="font-bold">Amount donated per charity:</p>
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
                    <table className="w-full md:w-3/4 text-center text-[8px] sm:text-sm md:text-md">
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
                            {data.map((item, index: number) => {
                                if (item.length === 0) return null;
                                return (
                                    <tr key={index}>
                                        {item.map((row, idx: number) => {
                                            return isDeleting &&
                                                variables === index ? (
                                                <td
                                                    key={idx}
                                                    className="opacitiy-50 scale-x-0 transition-all duration-300"
                                                >
                                                    {row}
                                                </td>
                                            ) : (
                                                <td key={idx}>{row}</td>
                                            );
                                        })}
                                        {isDeleteError && (
                                            <li style={{ color: "red" }}>
                                                {variables}
                                                <button
                                                    onClick={() =>
                                                        deleteRecord(variables!)
                                                    }
                                                >
                                                    Retry
                                                </button>
                                            </li>
                                        )}
                                        <td>
                                            <button
                                                onClick={() =>
                                                    deleteRecord(index)
                                                }
                                            >
                                                <Trash2 className="w-3 h-3 md:w-6 md:h-6" />
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
