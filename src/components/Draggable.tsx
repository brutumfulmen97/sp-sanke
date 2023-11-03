import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";

export default function Draggable(props: {
  id: number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  const rectRef = useRef(null);
  // if (transform) {
  //   console.log(rectRef.current?.getBoundingClientRect().x + transform.x);
  // }

  // if (transform) {
  //   if (
  //     rectRef.current?.getBoundingClientRect().right + transform.x >
  //     window.innerWidth
  //   ) {
  //     console.log("sad");
  //     transform.x =
  //       window.innerWidth - rectRef.current?.getBoundingClientRect().x;
  //   }
  // }

  const style = transform
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
