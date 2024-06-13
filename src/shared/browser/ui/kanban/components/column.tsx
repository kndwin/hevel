import { HTMLProps, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Card } from "@/shared/browser/ui/card";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import { cva } from "class-variance-authority";

export function KanbanColumn({
  children,
  className,
  id,
  ...props
}: {
  children: React.ReactNode;
  id: string;
} & HTMLProps<HTMLDivElement>) {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    invariant(ref.current);
    return dropTargetForElements({
      element: ref.current,
      onDragEnter: () => {
        setIsDraggedOver(true);
      },
      getData: () => ({ type: "column", id }),
      onDragLeave: () => {
        setIsDraggedOver(false);
      },
      onDrop: () => {
        setIsDraggedOver(false);
      },
    });
  }, []);
  return (
    <Card
      ref={ref}
      className={droppableColumnVariants({
        draggedOver: isDraggedOver,
        className,
      })}
      {...props}
    >
      {children}
    </Card>
  );
}

const droppableColumnVariants = cva("p-4 flex flex-col gap-4", {
  variants: {
    draggedOver: {
      true: "bg-accent",
    },
  },
  defaultVariants: {
    draggedOver: false,
  },
});
