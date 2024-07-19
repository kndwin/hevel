import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { useEffect, useRef } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from "tiny-invariant";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { match } from "ts-pattern";
import { Kanban } from "..";

export function KanbanBoard<TData extends { id: string }>({
  children,
  kanban,
  Headers,
  maxWidth,
  maxHeight,
}: {
  children: React.ReactNode;
  Headers: React.ReactNode;
  kanban: Kanban<TData>;
  maxWidth: string;
  maxHeight: string;
}) {
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

          const eventPayload = { dest: dest.data, source: source.data };

          match(kanban.actions.getCondition(eventPayload))
            .with("card-move-to-new-column", () => {
              kanban.actions.cardMoveToNewColumns(eventPayload);
            })
            .with("card-move-to-new-column-and-reposition-cards", () => {
              kanban.actions.cardMoveToNewColumnsAndRepositionCards(
                eventPayload
              );
            })
            .with("reposition-cards-in-same-column", () => {
              kanban.actions.repositionCardInSameColumn(eventPayload);
            });
        },
      })
    );
  });
  return (
    <div
      style={{ maxHeight, maxWidth }}
      ref={ref}
      className="flex flex-col w-full overflow-auto hover:scrollbar scrollbar-none scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-muted scrollbar-track-transparent"
    >
      <div>{Headers}</div>
      <div className="flex gap-6 h-fit">{children}</div>
    </div>
  );
}
