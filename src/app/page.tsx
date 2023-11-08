"use client";

import Charity from "@/components/Charity";
import { SledContext } from "@/context/sled-context";
import { TotalContext } from "@/context/total-context";
import { useState } from "react";
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
    const [popupOpen, setPopupOpen] = useState<boolean>(false);
    const [variant, setVariant] = useState<"success" | "error">("success");

    async function handleSubmit() {
        const data: TDataToSubmit = Object.values(charityNames).reduce(
            (acc, curr) => ({
                ...acc,
                [curr]: sleds.find((sled) => sled.id === curr)?.value,
            }),
            {}
        );

        const res = await axios.get("https://api.ipify.org?format=json");
        const { ip } = res.data;
        data.ip = ip;

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

            if (res.status === 425) {
                setPopupOpen(true);
                setVariant("error");
                throw new Error("You have already submitted");
            }
            if (!res.data) throw new Error("Something went wrong");
            if (res.status === 200) {
                setPopupOpen(true);
                setVariant("success");
            }
            setSleds(initialState);
            setTotal(0);
        } catch (e: any) {
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
                                    {popupOpen ? (
                                        <div className="popup">
                                            <div className="popup__content flex">
                                                <button
                                                    className="popup__content-close-btn"
                                                    onClick={() => {
                                                        setPopupOpen(false);
                                                    }}
                                                >
                                                    <Image
                                                        src="/closeBtn.png"
                                                        width={35}
                                                        height={35}
                                                        alt="close btn"
                                                    />
                                                </button>
                                                {variant === "success" ? (
                                                    <>
                                                        <h1 className="popup__title fontExtraBold">
                                                            KÖSZÖNJÜK!
                                                        </h1>
                                                        <p className="fontMedium">
                                                            Köszönjük, hogy
                                                            segíted a
                                                            rászorulókat!
                                                        </p>
                                                        <button className="popup__content-home-btn">
                                                            <a
                                                                href="https://www.nexon.hu/"
                                                                className="fontExtraBold"
                                                            >
                                                                HOME
                                                            </a>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h1 className="popup__title fontExtraBold">
                                                            MÁR KÜLDÖTTÉL!
                                                        </h1>
                                                        <p className="fontMedium">
                                                            Wait 10 minutes
                                                            before sending
                                                            again!
                                                        </p>
                                                        <button className="popup__content-home-btn">
                                                            <a
                                                                href="https://www.nexon.hu/"
                                                                className="fontExtraBold"
                                                            >
                                                                HOME
                                                            </a>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ) : null}
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
