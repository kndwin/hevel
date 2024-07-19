import { useState, useRef, useEffect, HTMLProps } from "react";
import { cva } from "class-variance-authority";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";
import { Card } from "@/shared/browser/ui/card";

type DraggableState = "idle" | "dragging" | "dropping";

export function KanbanCardDropIndicator(props: { edge: Edge }) {
  if (props.edge === "top") {
    return <div className="w-full h-2 bg-primary/10 absolute -top-1 left-0" />;
  }

  if (props.edge === "bottom") {
    return (
      <div className="w-full h-2 bg-primary/10 absolute -bottom-1 left-0" />
    );
  }
}

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
  const droppableRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<DraggableState>("idle");
  const [dragging, setDragging] = useState<Edge | "idle">("idle");

  useEffect(() => {
    invariant(ref.current);
    invariant(droppableRef.current);
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
        element: droppableRef.current,
        onDragEnter: (args) => {
          const closestEdgeOfTarget = extractClosestEdge(args.self.data);
          invariant(closestEdgeOfTarget);
          setDragging(closestEdgeOfTarget);
        },
        onDrop: () => {
          setDragging("idle");
        },
        onDragLeave: () => setDragging("idle"),
        getData: ({ input, element }) => {
          const data = { type: "card", id, index, columnId };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
      })
    );
  }, [id, columnId, index]);

  return (
    <div ref={droppableRef} className="relative px-4 py-2">
      {dragging !== "idle" && <KanbanCardDropIndicator edge={dragging} />}
      <Card
        className={draggableVariants({ state, className })}
        ref={ref}
        {...props}
      >
        {children}
      </Card>
    </div>
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
