import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import { SledContext } from "@/context/sled-context";
import { useContext, useEffect, useState } from "react";
import { TotalContext } from "@/context/total-context";
import Image from "next/image";

const Charity = ({
  title,
  image,
  link,
  id,
  parent,
  value,
}: {
  image: string;
  title: string;
  link: string;
  id: number;
  parent: string;
  value: number;
}) => {
  const containers = Array.from({ length: 13 }, (_, i) => i.toString());
  const { sleds, setSleds } = useContext(SledContext);
  const { total, setTotal } = useContext(TotalContext);
  const [style, setStyle] = useState({
    cursor: "grab",
  });

  const draggableMarkup = (
    <Draggable id={id}>
      <div
        className="text-center text-xs font-semibold md:text-md w-full 
        "
        style={style}
      >
        <div className="relative w-full h-12 grid place-items-center">
          <Image
            src="/sanke.png"
            width={100}
            height={300}
            alt="snake"
            className="absolute max-w-[200%]"
          />
        </div>
      </div>
    </Draggable>
  );

  useEffect(() => {
    if (+total < 3_000_000 || value !== 0) {
      setStyle({
        cursor: "grab",
      });
    } else {
      setStyle({
        cursor: "not-allowed",
      });
    }
  }, [total, value]);

  return (
    <div className="w-full relative mb-12">
      <h2 className="w-full text-end pr-4 text-2xl text-blue-900">
        {new Intl.NumberFormat("hu-HU", {
          style: "currency",
          currency: "HUF",
          maximumFractionDigits: 0,
        }).format(+parent * 250000)}
      </h2>
      <Image
        src={image}
        alt={title}
        width={1000}
        height={1000}
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      <div className="absolute w-full top-[20%] px-[5%]">
        <div className="flex justify-between ">
          <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={() => {
              setStyle({
                cursor: "grabbing",
              });
            }}
            modifiers={[restrictToHorizontalAxis]}
          >
            {containers.map((id: string) => (
              <Droppable
                key={id}
                id={id}
                className="text-center text-xs md:text-md w-full"
              >
                {parent === id ? draggableMarkup : ""}
              </Droppable>
            ))}
          </DndContext>
        </div>
        <div className="flex gap-8 mt-[2%] w-full items-center justify-start">
          <Image
            src="/info.png"
            width={50}
            height={50}
            style={{
              width: "7%",
              height: "auto",
            }}
            className="max-w-[70px]"
            alt="info"
          />
          <a
            href={`https://${link}`}
            target="_blank"
            className="w-[7%] max-w-[70px]"
          >
            <Image
              src="/link.png"
              width={50}
              height={50}
              style={{
                width: "100%",
                height: "auto",
              }}
              alt="info"
            />
          </a>
        </div>
      </div>
    </div>
  );

  function handleDragEnd(event: any) {
    const { over } = event;

    let newSleds;
    const newTotal = +total - +parent * 250000;

    let newValue;
    newSleds = sleds.map((sled: { id: number; parent: string }) => {
      if (id === sled.id) {
        if (newTotal + over.id * 250000 > 3_000_000) {
          const maxParent = Math.floor((3_000_000 - newTotal) / 250000);
          newValue = maxParent * 250000;
          return {
            ...sled,
            parent: over ? maxParent.toString() : null,
            value: newValue,
          };
        }
        return {
          ...sled,
          parent: over ? over.id : null,
          value: over ? +over.id * 250000 : 0,
        };
      }
      return sled;
    });

    setSleds(newSleds as Sled[]);
    setTotal(newTotal + (newValue ?? over.id * 250000));
  }
};

export default Charity;
