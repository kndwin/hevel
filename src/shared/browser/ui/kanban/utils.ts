import { ColumnDefInit, ColumnsDef } from "./use-kanban";
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/closest-edge";

export function getColumnFromData<TData extends { id: string }>({
  data,
  columns,
}: {
  data: Array<TData>;
  columns: ColumnDefInit;
}): ColumnsDef<TData> {
  const collated: ColumnsDef<TData> = [];
  const cardMap = new Map();

  data.map((card) => {
    cardMap.set(card.id, { data: card, id: card.id });
  });

  columns.map((col, colIdx) => {
    collated.push({ cards: [], id: col.id });
    col.cardIds.forEach((cardId) => {
      const existOnColumn = cardMap.get(cardId);
      if (existOnColumn) {
        collated[colIdx].cards.push(existOnColumn);
      }
    });
  });

  return collated;
}

export function wrapIndex(index: number, edge: Edge, length: number) {
  if (length === 0) return 0;
  if (edge === "top" && index === 0) return 0;
  if (edge === "bottom" && index === length - 1) return length - 1;
  if (edge === "top") return index;
  if (edge === "bottom") return index + 1;
  return 0;
}
