import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";

export default function Draggable(props: {
  id: number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  const rectRef = useRef<HTMLDivElement>(null);
  let outOfBounds = false;

  if (transform && rectRef.current) {
    if (
      rectRef.current?.getBoundingClientRect().x +
        transform.x -
        rectRef.current?.getBoundingClientRect().width / 2 >
      Math.max(960, window.innerWidth)
    ) {
      console.log("desno");
      outOfBounds = true;
    } else if (
      rectRef.current?.getBoundingClientRect().x +
        transform.x -
        rectRef.current?.getBoundingClientRect().width / 2 <
      0
    ) {
      console.log("levo");
      outOfBounds = true;
    }
  }

  const style =
    transform && !outOfBounds
      ? {
          transform: `translate3d(${transform.x}px,0, 0)`,
        }
      : undefined;

  return (
    <div
      ref={setNodeRef}
      className="touch-none test"
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="w-full" ref={rectRef}>
        {props.children}
      </div>
    </div>
  );
}
