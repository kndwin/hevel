import { ulid } from "ulidx";
import { ColumnsDef } from "./use-kanban";

export function getColumnFromData<TData>({
  data,
  key,
  columns,
}: {
  data: Array<TData>;
  key: keyof TData;
  columns: ColumnsDef<TData>;
}): ColumnsDef<TData> {
  const newColumns = structuredClone(columns);

  const columnIds = columns.map(({ id }) => id);
  data.forEach((cardData) => {
    const columnIndex = columnIds.findIndex((id) => id === cardData[key]);
    const newCard = { id: ulid(), data: cardData };
    newColumns[columnIndex].cards.push(newCard);
  });

  return newColumns;
}
