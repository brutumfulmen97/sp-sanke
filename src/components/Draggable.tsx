import { useDraggable } from "@dnd-kit/core";

export default function Draggable(props: TDraggableProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px,0, 0)`,
              touchAction: "none",
          }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </div>
    );
}
