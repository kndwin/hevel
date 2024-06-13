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

export type Applications = InferResponseType<
  typeof rpc.applications.$get
>["data"][number];

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: Actions;
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  const id = row.original?.id as string;

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onMouseDown={() => actions.view(id)}>
        View
      </Button>
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
          <DropdownMenuItem onMouseDown={() => actions.edit(id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onMouseDown={() => actions.delete(id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
