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
    charityNames,
} from "@/constants";
import axios from "axios";

const initialState: TSled[] = Object.values(charityNames).map((name) => ({
    id: name,
    parent: "0",
    value: 0,
}));

export default function Home() {
    const [sleds, setSleds] = useState<TSled[]>(initialState);
    const [total, setTotal] = useState<number>(0);

    async function handleSubmit() {
        if (total < 3_000_000) return toast.error("Total must be 3 000 000 Ft");

        const data = Object.values(charityNames).reduce(
            (acc, curr) => ({
                ...acc,
                [curr]: sleds.find((sled) => sled.id === curr)?.value,
            }),
            {}
        );

        console.log(process.env.NODE_ENV);
        let API_URL;
        if (process.env.NODE_ENV === "development")
            API_URL = API_URL_DEVELOPMENT;
        if (process.env.NODE_ENV === "test") API_URL = API_URL_STAGING;
        if (process.env.NODE_ENV === "production") API_URL = API_URL_PRODUCTION;

        try {
            const res = await axios.post(
                API_URL!,
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
                                            image={CharityImages[id]}
                                            title={CharityTitles[id]}
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
