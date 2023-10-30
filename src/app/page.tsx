"use client";

import Charity from "@/components/Charity";
import { SledContext } from "@/context/sled-context";
import { useState } from "react";

const initialState = [
    { id: 1, parent: "0" },
    { id: 2, parent: "0" },
    { id: 3, parent: "0" },
    { id: 4, parent: "0" },
];

export default function Home() {
    const [sleds, setSleds] = useState(initialState);

    return (
        <>
            {/*@ts-ignore*/}
            <SledContext.Provider value={{ sleds, setSleds }}>
                {sleds.map((sled) => {
                    return (
                        <Charity
                            id={sled.id}
                            parent={sled.parent}
                            key={sled.id}
                        />
                    );
                })}

                <div className="w-full flex gap-4 justify-center items-center">
                    <button
                        onClick={() => setSleds(initialState)}
                        className="px-4 py-2 bg-red-500 rounded-full text-white"
                    >
                        VRATI
                    </button>
                    <button className="px-4 py-2 bg-red-500 rounded-full text-white">
                        SACUVAJ
                    </button>
                </div>
            </SledContext.Provider>
        </>
    );
}
