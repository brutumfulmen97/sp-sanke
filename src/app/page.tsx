"use client";

import Charity from "@/components/Charity";
import { SledContext } from "@/context/sled-context";
import { TotalContext } from "@/context/total-context";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import {
    CharityImages,
    CharityLinks,
    CharityTitles,
    LandingText,
} from "@/constants";
import axios from "axios";

const initialState: TSled[] = [
    { id: "szentistvanzene", parent: "0", value: 0 },
    { id: "autizmus", parent: "0", value: 0 },
    { id: "elelmiszerbank", parent: "0", value: 0 },
    { id: "lampas92", parent: "0", value: 0 },
];

export default function Home() {
    const [sleds, setSleds] = useState<TSled[]>(initialState);
    const [total, setTotal] = useState<number>(0);

    async function handleSubmit() {
        if (total < 3_000_000) return toast.error("Total must be 3 000 000 Ft");

        const data = {
            charityA: sleds[0].value,
            charityB: sleds[1].value,
            charityC: sleds[2].value,
            charityD: sleds[3].value,
        };

        try {
            const res = await axios.post(
                API_URL,
                {
                    data,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.status === 425) throw new Error("Wait 10 minutes");
            if (!res.data) throw new Error("Something went wrong");
            setSleds(initialState);
            setTotal(0);
            toast.success("Successfully saved");
        } catch (e: any) {
            toast.error(e.message);
            console.log(e.message);
        }
    }

    return (
        <div className="container">
            <main>
                <Image
                    src={"/bgImage.png"}
                    width={1920}
                    height={1080}
                    alt="bg image"
                    priority
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                />
                <h1 className="main-title fontExtraBoldItalic">
                    AZ AJÁNDÉK KÖZÖS
                </h1>
                <div className="main__content">
                    <Image
                        src="/dugme.png"
                        width={300}
                        height={300}
                        className="main__content-button"
                        alt="button"
                    />
                    <p className="fontMedium">{LandingText}</p>
                    <Toaster />
                    <div className="main__content-container">
                        <TotalContext.Provider value={{ total, setTotal }}>
                            <SledContext.Provider value={{ sleds, setSleds }}>
                                {sleds.map(({ id, parent, value }) => {
                                    return (
                                        <Charity
                                            //@ts-ignore
                                            image={CharityImages[id]}
                                            //@ts-ignore
                                            title={CharityTitles[id]}
                                            //@ts-ignore
                                            link={CharityLinks[id]}
                                            id={id}
                                            parent={parent}
                                            key={id}
                                            value={value}
                                        />
                                    );
                                })}

                                <div className="main__content-container-buttons">
                                    <button
                                        onClick={() => {
                                            setSleds(initialState);
                                            setTotal(0);
                                        }}
                                        disabled={total === 0}
                                        className="main__content-container-button-back  fontExtraBold"
                                    >
                                        VISSZAÁLLÍTÁS
                                    </button>
                                    <button
                                        className="main__content-container-button-save  fontExtraBold"
                                        onClick={handleSubmit}
                                        disabled={total < 3_000_000}
                                    >
                                        ELKÜLDÖM
                                    </button>
                                </div>
                            </SledContext.Provider>
                        </TotalContext.Provider>
                    </div>
                </div>
            </main>
        </div>
    );
}
