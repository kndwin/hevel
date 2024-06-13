import { XIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/shared/browser/ui/button";
import { Input } from "@/shared/browser/ui/input";

import { DataTableFacetedFilter } from "./faceted-filter";
import { DataTableViewOptions } from "./view-options";

import {
  CheckCircleIcon,
  CircleIcon,
  XCircleIcon,
  WatchIcon,
  Tally1Icon,
  Tally2Icon,
  Tally3Icon,
} from "lucide-react";

export const statuses = [
  {
    value: "not-started",
    label: "Not started",
    icon: XCircleIcon,
  },
  {
    value: "applied",
    label: "Applied",
    icon: CircleIcon,
  },
  {
    value: "interviewing",
    label: "Interviewing",
    icon: WatchIcon,
  },
  {
    value: "offer-given",
    label: "Offer given",
    icon: CheckCircleIcon,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircleIcon,
  },
  {
    value: "expired",
    label: "Expired",
    icon: XCircleIcon,
  },
];

export const sentiments = [
  {
    label: "Low",
    value: "low",
    icon: Tally1Icon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: Tally2Icon,
  },
  {
    label: "High",
    value: "high",
    icon: Tally3Icon,
  },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col-reverse md:flex-row flex-1 md:items-center gap-2">
        <Input
          placeholder="Search jobs..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("sentiment") && (
          <DataTableFacetedFilter
            column={table.getColumn("sentiment")}
            title="Sentiment"
            options={sentiments}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
