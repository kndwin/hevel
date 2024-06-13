import { useState, useRef, useEffect, HTMLProps } from "react";
import { cva } from "class-variance-authority";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from "tiny-invariant";
import { Card } from "@/shared/browser/ui/card";

type DraggableState = "idle" | "dragging" | "dropping";

export function KanbanCard({
  index,
  className,
  columnId,
  children,
  id,
  ...props
}: {
  index: number;
  id: string;
  columnId: string;
} & HTMLProps<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<DraggableState>("idle");

  useEffect(() => {
    invariant(ref.current);
    return combine(
      draggable({
        element: ref.current,
        getInitialData: () => ({ type: "card", id, index, columnId }),
        onDragStart: () => setState("dragging"), // NEW
        onDrop: () => {
          setState("dropping");
        },
      }),
      dropTargetForElements({
        element: ref.current,
      })
    );
  }, [id]);

  return (
    <Card
      className={draggableVariants({ state, className })}
      ref={ref}
      {...props}
    >
      {children}
    </Card>
  );
}

const draggableVariants = cva("", {
  variants: {
    state: {
      idle: "",
      dragging: "opacity-50",
      dropping: "",
    },
  },
  defaultVariants: {
    state: "idle",
  },
});
