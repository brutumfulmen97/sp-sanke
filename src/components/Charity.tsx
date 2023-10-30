import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { useState } from "react";
import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import { SledContext } from "@/context/sled-context";
import { useContext } from "react";

const Charity = ({ id, parent }: any) => {
    const containers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const { sleds, setSleds } = useContext(SledContext);

    const draggableMarkup = (
        <Draggable id={id}>
            <div className=" text-center bg-green-300">Drag Me</div>
        </Draggable>
    );

    console.log(sleds);

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
                            className="text-center border-2"
                        >
                            {parent === id ? draggableMarkup : "Drop here"}
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

        const newSleds = sleds.map((sled: { id: number; parent: string }) => {
            if (id === sled.id) {
                return { ...sled, parent: over ? over.id : null };
            }
            return sled;
        });

        setSleds(newSleds);
    }
};

export default Charity;
