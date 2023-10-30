import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { useState } from "react";
import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import { SledContext } from "@/context/sled-context";
import { useContext } from "react";

const Charity = ({ id, parent }: any) => {
    const [value, setValue] = useState(0);
    const containers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const { sleds, setSleds } = useContext(SledContext);
    const draggableMarkup = (
        <Draggable id={id}>
            <div className="w-[150px] text-center bg-green-300">Drag Me</div>
        </Draggable>
    );
    return (
        <div>
            <div className="flex w-[1500px] border-2 border-black">
                <DndContext
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToHorizontalAxis]}
                >
                    {containers.map((id) => (
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
            <h2>
                {new Intl.NumberFormat("hu-HU", {
                    style: "currency",
                    currency: "HUF",
                    maximumFractionDigits: 0,
                }).format(value)}
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
        if (over) {
            setValue(+over.id * 250000);
        }
    }
};

export default Charity;
