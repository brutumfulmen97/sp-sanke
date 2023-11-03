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
  // console.log(
  //   rectRef.current?.getBoundingClientRect().x +
  //     rectRef.current?.getBoundingClientRect().width
  // );
  console.log(window.innerWidth);
  let outOfBounds = false;

  // if (transform && rectRef.current) {
  //   if (
  //     rectRef.current?.getBoundingClientRect().x +
  //       transform.x -
  //       rectRef.current?.getBoundingClientRect().width / 2 >
  //     Math.max(960, window.innerWidth)
  //   ) {
  //     console.log("desno");
  //     outOfBounds = true;
  //   } else if (
  //     rectRef.current?.getBoundingClientRect().x +
  //       transform.x -
  //       rectRef.current?.getBoundingClientRect().width / 2 <
  //     0
  //   ) {
  //     console.log("levo");
  //     outOfBounds = true;
  //   }
  // }

  // transform && console.log(transform.x);

  if (transform && rectRef.current) {
    const rect = rectRef.current.getBoundingClientRect();
    if (
      rect.x + rect.width >=
      (window.innerWidth > 960
        ? 960 + (window.innerWidth - 960) / 2
        : window.innerWidth)
    ) {
      console.log(rect.x + rect.width);
      transform.x = 0;
    } else if (
      rect.x <= (window.innerWidth > 960 ? (window.innerWidth - 960) / 2 : 0)
    ) {
      console.log("levo");
      transform.x = 0;
    }
  }

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
