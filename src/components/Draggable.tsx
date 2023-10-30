import { useDraggable } from "@dnd-kit/core";

export default function Draggable(props: {
    id: string;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });
    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, 0, 0)`,
          }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            className="touch-none"
            style={style}
            {...listeners}
            {...attributes}
        >
            {props.children}
        </div>
    );
}
