"use client";

import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import { DndContext } from "@dnd-kit/core";
import { useState } from "react";

export default function Home() {
    const containers = ["A", "B", "C"];
    const [parent, setParent] = useState(null);
    const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

    return (
        <div className="flex gap-4">
            <DndContext onDragEnd={handleDragEnd}>
                {parent === null ? draggableMarkup : null}

                {containers.map((id) => (
                    // We updated the Droppable component so it would accept an `id`
                    // prop and pass it to `useDroppable`
                    <Droppable key={id} id={id}>
                        {parent === id ? draggableMarkup : "Drop here"}
                    </Droppable>
                ))}
            </DndContext>
        </div>
    );

    function handleDragEnd(event: any) {
        const { over } = event;

        setParent(over ? over.id : null);
    }
}
