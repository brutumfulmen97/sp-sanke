import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";

export default function Draggable(props: TDraggableProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });

    const rectRef = useRef<HTMLDivElement>(null);

    if (transform && rectRef.current) {
        const rect = rectRef.current.getBoundingClientRect();
        if (
            rect.x + rect.width >=
            (window.innerWidth > 960
                ? 960 + (window.innerWidth - 960) / 2
                : window.innerWidth)
        ) {
            transform.x = 0;
        } else if (
            rect.x <=
            (window.innerWidth > 960 ? (window.innerWidth - 960) / 2 : 0)
        ) {
            transform.x = 0;
        }
    }

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px,0, 0)`,
              touchAction: "none",
          }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <div className="w-full" ref={rectRef}>
                {props.children}
            </div>
        </div>
    );
}
