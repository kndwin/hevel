import { useImmer } from "use-immer";
import {
  DropTargetRecord,
  ElementDragPayload,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import {
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getColumnFromData, wrapIndex } from "./utils";
import invariant from "tiny-invariant";
import { useEffect } from "react";

export type ColumnDefInit = Array<{ id: string; cardIds: string[] }>;
export type ColumnsDef<TData> = Array<ColumnDef<TData>>;
export type ColumnDef<TData> = {
  id: string;
  cards: Array<Card<TData>>;
};

export type Card<TData> = {
  id: string;
  data: TData;
};

export type Kanban<TData extends { id: string }> = ReturnType<
  typeof useKanban<TData>
>;

type UseKanbanProps<TData> = {
  columns: ColumnDefInit;
  data: TData[];
  eventListeners?: KanbanEventListeners;
};

export type KanbanEventListeners = {
  onCardMoveToNewColumn?: (props: {
    fromColumnId: string;
    toColumnId: string;
    cardId: string;
  }) => void;
  onCardMoveToNewColumnAndRespositionCards?: (props: {
    toColumnId: string;
    toCardId: string;
    fromCardId: string;
    fromColumnId: string;
    edge: Edge;
  }) => void;
};

type EventPayload = {
  dest: DropTargetRecord["data"];
  source: ElementDragPayload["data"];
};

export function useKanban<TData extends { id: string }>(
  props: UseKanbanProps<TData>
) {
  const [columns, setColumns] = useImmer<ColumnsDef<TData>>(
    getColumnFromData({
      columns: props.columns,
      data: props.data,
    })
  );

  useEffect(() => {
    setColumns(
      getColumnFromData({
        columns: props.columns,
        data: props.data,
      })
    );
  }, [props.data]);

  function getCondition({ source, dest }: EventPayload) {
    const isSameColumn = source.columnId === dest.columnId;

    if (source.type === "card" && dest.type === "column" && !isSameColumn) {
      return "card-move-to-new-column";
    }

    if (source.type === "card" && dest.type === "card" && !isSameColumn) {
      return "card-move-to-new-column-and-reposition-cards";
    }

    if (source.type === "card" && dest.type === "card" && isSameColumn) {
      return "reposition-cards-in-same-column";
    }

    return null;
  }

  function repositionCardInSameColumn({ dest, source }: EventPayload) {
    const columnId = dest.columnId as string;
    const edge = extractClosestEdge(dest);
    const fromCardIndex = source.index as number;
    let toCardIndex = dest.index as number;
    invariant(edge);

    setColumns((draft) => {
      const columnIndex = draft.findIndex(({ id }) => id === columnId);
      const cards = draft[columnIndex].cards;
      toCardIndex = wrapIndex(toCardIndex, edge, cards.length);
      const newCardList = reorder({
        list: draft[columnIndex].cards,
        startIndex: fromCardIndex,
        finishIndex: toCardIndex,
      });
      draft[columnIndex].cards = newCardList;
    });
  }

  function cardMoveToNewColumnsAndRepositionCards({
    dest,
    source,
  }: EventPayload) {
    const fromColumnId = source.columnId as string;
    const toColumnId = dest.columnId as string;
    const fromCardId = source.id as string;
    const edge = extractClosestEdge(dest);
    let toCardIndex = dest.index as number;
    invariant(edge);

    setColumns((draft) => {
      const columnIndex = {
        old: draft.findIndex(({ id }) => id === fromColumnId),
        new: draft.findIndex(({ id }) => id === toColumnId),
      };

      invariant(columnIndex.old > -1, `ColumnId ${fromColumnId} doesn't exist`);
      invariant(columnIndex.new > -1, `ColumnId ${toColumnId} doesn't exist`);

      const cards = {
        old: draft[columnIndex.old].cards,
        new: draft[columnIndex.new].cards,
      };

      const fromCard = cards.old.find(({ id }) => id === fromCardId);
      if (!fromCard) return;

      const toCard = cards.new[toCardIndex];

      draft[columnIndex.old].cards = cards.old.filter(
        (c) => c.id != fromCardId
      );

      toCardIndex = wrapIndex(toCardIndex, edge, cards.new.length);
      draft[columnIndex.new].cards.splice(toCardIndex, 0, fromCard);
      props?.eventListeners?.onCardMoveToNewColumnAndRespositionCards?.({
        toColumnId,
        fromCardId,
        fromColumnId,
        toCardId: toCard.id,
        edge,
      });
    });
  }

  function cardMoveToNewColumns({ source, dest }: EventPayload) {
    const cardId = source.id as string;
    const fromColumnId = source.columnId as string;
    const toColumnId = dest.id as string;

    setColumns((draft) => {
      const columnIndex = {
        old: draft.findIndex(({ id }) => id === fromColumnId),
        new: draft.findIndex(({ id }) => id === toColumnId),
      };

      invariant(columnIndex.old > -1, `ColumnId ${fromColumnId} doesn't exist`);
      invariant(columnIndex.new > -1, `ColumnId ${toColumnId} doesn't exist`);

      const cards = {
        old: draft[columnIndex.old].cards,
        new: draft[columnIndex.new].cards,
      };

      const card = cards.old.find(({ id }) => id === cardId);
      if (!card) return;

      draft[columnIndex.old].cards = cards.old.filter((c) => c.id != cardId);
      draft[columnIndex.new].cards.push(card);
      props?.eventListeners?.onCardMoveToNewColumn?.({
        toColumnId,
        fromColumnId,
        cardId: card.id,
      });
    });
  }

  return {
    columns,
    actions: {
      getCondition,
      cardMoveToNewColumns,
      cardMoveToNewColumnsAndRepositionCards,
      repositionCardInSameColumn,
    },
  };
}
