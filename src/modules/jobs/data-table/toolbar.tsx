import { XIcon, PlusIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/shared/browser/ui/button";
import { Input } from "@/shared/browser/ui/input";

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
        <Button
          className="ml-auto h-8 pl-2"
          size="sm"
          onMouseDown={() => table.options.meta?.actions?.add()}
        >
          <PlusIcon className="mr-2" />
          Add new job
        </Button>
      </div>
    </div>
  );
}
