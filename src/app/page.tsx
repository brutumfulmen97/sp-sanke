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
            </SledContext.Provider>
        </>
    );
}
