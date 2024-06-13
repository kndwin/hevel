import { useCollapseSideNav } from "@/routes/_home";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { useEffect, useRef } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from "tiny-invariant";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Kanban } from "..";

export function KanbanBoard<TData>({
  children,
  kanban,
}: {
  children: React.ReactNode;
  kanban: Kanban<TData>;
}) {
  const [collapsed] = useCollapseSideNav();

  const ref = useRef(null);
  useEffect(() => {
    invariant(ref.current);
    return combine(
      autoScrollForElements({
        element: ref.current,
      }),
      monitorForElements({
        onDrop: ({ location, source }) => {
          const dest = location.current.dropTargets[0];
          if (!dest) return;

          const condition = kanban.actions.utils.getCondition({ dest, source });

          if (condition === "card-move-to-new-column") {
            kanban.actions.cards.moveColumns({
              cardId: source.data.id as string,
              fromColumnId: source.data.columnId as string,
              toColumnId: dest.data.id as string,
            });
          }
        },
      })
    );
  });
  return (
    <div
      style={{
        minHeight: "calc(100vh - 170px)",
        maxWidth: `calc(100vw - ${collapsed ? 75 + 48 : 200 + 48}px)`,
      }}
      ref={ref}
      className="flex gap-6 w-full overflow-auto hover:scrollbar scrollbar-none scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-muted scrollbar-track-transparent"
    >
      {children}
    </div>
  );
}
