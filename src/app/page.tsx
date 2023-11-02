"use client";

import Charity from "@/components/Charity";
import { SledContext } from "@/context/sled-context";
import { TotalContext } from "@/context/total-context";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const initialState = [
  { id: 1, parent: "0", value: 0 },
  { id: 2, parent: "0", value: 0 },
  { id: 3, parent: "0", value: 0 },
  { id: 4, parent: "0", value: 0 },
];

const links = [
  "www.szentistvanzene.hu",
  "www.autizmus.hu",
  "www.elelmiszerbank.hu",
  "www.lampas92.hu",
];

const titles = [
  "Szent István Zenei Alapítvány",
  "Autizmus Alapítvány",
  "Élelmiszerbank egyesület",
  "Lámpás 92 Alapítvány",
];

const images = ["/sneg1.png", "/sneg2.png", "/sneg3.png", "/sneg4.png"];

export default function Home() {
  const [sleds, setSleds] = useState<Sled[]>(initialState);
  const [total, setTotal] = useState<number>(0);

  async function handleSubmit() {
    if (total < 3_000_000) return toast.error("Total must be 3.000.000 Ft");

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
    <main className="w-full ">
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
      <div className="absolute w-full inset-0 mt-[55%] flex flex-col items-center justify-start ">
        <Image
          src="/dugme.png"
          width={300}
          height={300}
          style={{
            width: "40%",
          }}
          alt="dugme"
        />
        <p className="px-4 text-lg text-center mt-4">
          A szánkópályán minden beosztás 250 ezer forintot jelent. Húzza a
          szánkókat aszerint. ahogyan Ön osztaná el az adományt az alapítvanyok
          között. A kivalasztott arányokat végül egyesitjük, s ennek megfelelöen
          osztjuk szét a felajánlott összeget a négy szervezet között. Miután
          végzett, az &quot;Elküldöm&quot; gombra kattintva véglegesitse
          döntését.
        </p>
        <Toaster />
        <TotalContext.Provider value={{ total, setTotal }}>
          <SledContext.Provider value={{ sleds, setSleds }}>
            {sleds.map((sled, idx) => {
              return (
                <Charity
                  image={images[idx]}
                  title={titles[idx]}
                  link={links[idx]}
                  id={sled.id}
                  parent={sled.parent}
                  key={sled.id}
                  value={sled.value}
                />
              );
            })}

            <div className="w-full px-[15%] mt-12 flex gap-[10%] justify-center items-center mb-4">
              <button
                onClick={() => {
                  setSleds(initialState);
                  setTotal(0);
                }}
                disabled={total === 0}
                className="w-full py-2 bg-[#e3f6fc] border-[3px] border-[#78909c] text-[#78909c] rounded-full font-bold"
              >
                VRATI
              </button>
              <button
                className="w-full py-2 bg-[#14A351] disabled:bg-[#8caab5] border-[3px] border-white rounded-full text-white font-bold"
                onClick={handleSubmit}
                disabled={total < 3_000_000}
              >
                SACUVAJ
              </button>
            </div>
          </SledContext.Provider>
        </TotalContext.Provider>
      </div>
    </main>
  );
}
