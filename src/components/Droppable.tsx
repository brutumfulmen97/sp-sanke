import { useDroppable } from "@dnd-kit/core";

export default function Droppable(props: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} className={props.className}>
      {props.children}
    </div>
  );
}
