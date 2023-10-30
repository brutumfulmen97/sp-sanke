"use client";

import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import { DndContext } from "@dnd-kit/core";
import {
    restrictToHorizontalAxis,
    createSnapModifier,
    restrictToParentElement,
} from "@dnd-kit/modifiers";
import { useState } from "react";

export default function Home() {
    const containers = ["A", "B", "C"];
    const [parent, setParent] = useState(null);
    const draggableMarkup = (
        <Draggable id="draggable">
            <div className="w-[150px] border-2 border-red bg-gray-200 text-center">
                Drag Me
            </div>
        </Draggable>
    );

    const gridSize = 150; // pixels
    const snapToGridModifier = createSnapModifier(gridSize);

    return (
        <div className="flex w-[600px] border-2 border-black">
            <DndContext
                onDragEnd={handleDragEnd}
                modifiers={[
                    restrictToHorizontalAxis,
                    snapToGridModifier,
                    restrictToParentElement,
                ]}
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
    );

    function handleDragEnd(event: any) {
        const { over } = event;

        setParent(over ? over.id : null);
    }

    function snapToGrid(args: any) {
        const { transform } = args;

        return {
            ...transform,
            x: Math.ceil(transform.x / gridSize) * gridSize,
            y: Math.ceil(transform.y / gridSize) * gridSize,
        };
    }
}
