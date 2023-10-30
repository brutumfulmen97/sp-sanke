import { useDroppable } from "@dnd-kit/core";

export default function Droppable(props: {
    id: string;
    children: React.ReactNode;
    className?: string;
}) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        border: isOver ? "1px solid darkgreen" : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className={props.className}>
            {props.children}
        </div>
    );
}
