"use client";

import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { useState } from "react";

export default function Home() {
    const [value, setValue] = useState(0);
    const containers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const [parent, setParent] = useState(null);
    const draggableMarkup = (
        <Draggable id="draggable">
            <div className="w-[150px] text-center">Drag Me</div>
        </Draggable>
    );

    return (
        <>
            <div className="flex w-[1500px] border-2 border-black">
                <DndContext
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToHorizontalAxis]}
                >
                    {parent === null ? draggableMarkup : null}

                    {containers.map((id) => (
                        // We updated the Droppable component so it would accept an `id`
                        // prop and pass it to `useDroppable`
                        <Droppable
                            key={id}
                            id={id}
                            className="w-[150px] text-center border-2"
                        >
                            {parent === id ? draggableMarkup : "Drop here"}
                        </Droppable>
                    ))}
                </DndContext>
            </div>
            <h2>{value}ft</h2>
        </>
    );

    function handleDragEnd(event: any) {
        const { over } = event;

        setParent(over ? over.id : null);
        if (over) {
            setValue(+over.id * 25000);
        }
    }
}
