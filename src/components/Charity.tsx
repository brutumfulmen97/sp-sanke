import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import { SledContext } from "@/context/sled-context";
import { useContext, useEffect, useState } from "react";
import { TotalContext } from "@/context/total-context";

const Charity = ({
    id,
    parent,
    value,
}: {
    id: number;
    parent: string;
    value: number;
}) => {
    const containers = Array.from({ length: 13 }, (_, i) => i.toString());
    const { sleds, setSleds } = useContext(SledContext);
    const { total, setTotal } = useContext(TotalContext);
    const [style, setStyle] = useState({
        background: "lightgreen",
        cursor: "grab",
    });

    const draggableMarkup = (
        <Draggable id={id}>
            <div
                className=" text-center text-xs font-semibold md:text-md w-full h-4"
                style={style}
            ></div>
        </Draggable>
    );

    useEffect(() => {
        if (+total < 3_000_000 || value !== 0) {
            setStyle({
                background: "lightgreen",
                cursor: "grab",
            });
        } else {
            setStyle({
                background: "lightcoral",
                cursor: "not-allowed",
            });
        }
    }, [total, value]);

    return (
        <div className="w-full">
            <div className="flex justify-between border-2 border-black">
                <DndContext
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToHorizontalAxis]}
                >
                    {containers.map((id) => (
                        <Droppable
                            key={id}
                            id={id}
                            className="text-center border-2 text-xs md:text-md w-full"
                        >
                            {parent === id ? draggableMarkup : ""}
                        </Droppable>
                    ))}
                </DndContext>
            </div>
            <h2>
                {new Intl.NumberFormat("hu-HU", {
                    style: "currency",
                    currency: "HUF",
                    maximumFractionDigits: 0,
                }).format(+parent * 250000)}
            </h2>
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
                    const maxParent = Math.floor(
                        (3_000_000 - newTotal) / 250000
                    );
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
