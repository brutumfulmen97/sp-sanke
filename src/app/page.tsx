"use client";

import Charity from "@/components/Charity";
import { SledContext } from "@/context/sled-context";
import { TotalContext } from "@/context/total-context";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const initialState = [
    { id: 1, parent: "0", value: 0 },
    { id: 2, parent: "0", value: 0 },
    { id: 3, parent: "0", value: 0 },
    { id: 4, parent: "0", value: 0 },
];

export default function Home() {
    const [sleds, setSleds] = useState(initialState);
    const [total, setTotal] = useState(0);

    async function handleSubmit() {
        if (total < 3_000_000) return alert("Nije dovoljno novca");

        const data = {
            charityA: sleds[0].value,
            charityB: sleds[1].value,
            charityC: sleds[2].value,
            charityD: sleds[3].value,
        };

        try {
            const res = await fetch("/api/sheets", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 425) throw new Error("Wait 10 minutes");
            if (!res.ok) throw new Error("Something went wrong");
            setSleds(initialState);
            setTotal(0);
            toast.success("Successfully saved");
        } catch (e: any) {
            toast.error(e.message);
            console.log(e.message);
        }
    }

    return (
        <main className="md:p-4">
            <Toaster />
            {/*@ts-ignore*/}
            <TotalContext.Provider value={{ total, setTotal }}>
                {/*@ts-ignore*/}
                <SledContext.Provider value={{ sleds, setSleds }}>
                    {sleds.map((sled) => {
                        return (
                            <Charity
                                id={sled.id}
                                parent={sled.parent}
                                key={sled.id}
                                value={sled.value}
                            />
                        );
                    })}

                    <div className="w-full flex gap-4 justify-center items-center">
                        <button
                            onClick={() => {
                                setSleds(initialState);
                                setTotal(0);
                            }}
                            disabled={total === 0}
                            className="px-4 py-2 bg-red-500 rounded-full text-white disabled:opacity-30"
                        >
                            VRATI
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 rounded-full text-white disabled:opacity-30"
                            onClick={handleSubmit}
                            disabled={total < 3_000_000}
                        >
                            SACUVAJ
                        </button>
                    </div>
                    <h1>TOTAL: {total} Ft</h1>
                    <h2>LEFT: {3_000_000 - total} Ft</h2>
                </SledContext.Provider>
            </TotalContext.Provider>
        </main>
    );
}
