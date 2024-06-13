import { MoreHorizontalIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/shared/browser/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/browser/ui/dropdown-menu";
import { rpc } from "@/shared/browser/rpc/client";
import type { InferResponseType } from "@/shared/browser/rpc/client";
import { Actions } from "@/shared/browser/ui/table";

export type Job = InferResponseType<typeof rpc.jobs.$get>["data"][0];

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: Actions;
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  const job = row.original as Job;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onMouseDown={(e) => {
              e.stopPropagation();
              actions.edit(job.id);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onMouseDown={() => actions.delete(job.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
