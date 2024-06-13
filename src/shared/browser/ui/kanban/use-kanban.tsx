import { useImmer } from "use-immer";
import {
  DropTargetRecord,
  ElementDragPayload,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { getColumnFromData } from "./utils";

export type ColumnsDef<TData> = Array<ColumnDef<TData>>;
export type ColumnDef<TData> = {
  id: string;
  cards: Array<Card<TData>>;
};

export type Card<TData> = {
  id: string;
  data: TData;
};

export type Kanban<TData> = ReturnType<typeof useKanban<TData>>;

export function useKanban<TData>(props: {
  columns: ColumnsDef<TData>;
  data: TData[];
  dataAccessorKey: keyof TData;
}) {
  const [columns, setColumns] = useImmer<ColumnsDef<TData>>(
    getColumnFromData({
      columns: props.columns,
      data: props.data,
      key: props.dataAccessorKey,
    })
  );

  function cardMoveColumns(props: {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
  }) {
    setColumns((draft) => {
      const { cardId, toColumnId, fromColumnId } = props;
      const index = {
        old: draft.findIndex(({ id }) => id === fromColumnId),
        new: draft.findIndex(({ id }) => id === toColumnId),
      };

      const card = draft[index.old].cards.find(({ id }) => id === cardId);
      if (!card) return;

      draft[index.old].cards = draft[index.old].cards.filter(
        (c) => c.id != cardId
      );
      draft[index.new].cards.unshift(card);
    });
  }

  function getCondition(props: {
    dest: DropTargetRecord;
    source: ElementDragPayload;
  }) {
    console.debug("getCondition()");
    const { source, dest } = props;

    const isSameColumn = source.data.columnId === dest.data.columnId;
    const isCardMovingToNewColumn =
      source.data.type === "card" &&
      dest.data.type === "column" &&
      !isSameColumn;

    if (isCardMovingToNewColumn) {
      return "card-move-to-new-column";
    }

    return;
  }

  return {
    columns,
    actions: {
      utils: {
        getCondition,
      },
      cards: {
        moveColumns: cardMoveColumns,
      },
    },
  };
}
