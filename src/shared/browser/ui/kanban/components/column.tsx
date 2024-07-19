import { HTMLProps, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Card } from "@/shared/browser/ui/card";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { cn } from "../../utils";

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
  const [draggedState, setDraggedState] = useState<"dragged-over" | "idle">(
    "idle"
  );

  useEffect(() => {
    invariant(ref.current);
    return dropTargetForElements({
      element: ref.current,
      onDragEnter: () => {
        console.log("dragging over column: ", id);
        setDraggedState("dragged-over");
      },
      getData: () => ({ type: "column", id, columnId: id }),
      onDragLeave: () => {
        setDraggedState("idle");
      },
      onDrop: () => {
        setDraggedState("idle");
      },
    });
  }, []);

  return (
    <Card
      ref={ref}
      data-state={draggedState}
      className={cn(
        "flex flex-col w-full flex-1 h-auto data-[state=dragged-over]:bg-secondary",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
