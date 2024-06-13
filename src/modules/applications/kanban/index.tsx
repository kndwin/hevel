import { ColumnsDef } from "@/shared/browser/ui/kanban/use-kanban";
import { Applications } from "../data-table/row-actions";

export const initalColumns: ColumnsDef<Applications> = [
  { cards: [], id: "not-started" },
  { cards: [], id: "applied" },
  { cards: [], id: "interview" },
  { cards: [], id: "rejected" },
  { cards: [], id: "interviewing" },
  { cards: [], id: "expired" },
];
