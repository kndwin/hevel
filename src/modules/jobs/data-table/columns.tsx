import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/browser/ui/badge";
import { ExternalLinkIcon } from "lucide-react";

import { AUD } from "@/shared/utils/currency";

import { Job } from "./row-actions";
import { DataTableColumnHeader } from "./column-header";
import { DataTableRowActions } from "./row-actions";

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "id",
    enableHiding: true,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap space-x-2">
          <a
            href={row.original.sourceUrl ?? ""}
            target="_blank"
            className="max-w-[500px] truncate font-medium text-wrap flex items-center "
          >
            <ExternalLinkIcon className="w-4 h-4 mr-2" />
            <span className="truncate text-ellipsis whitespace-pre">
              {row.getValue("title") || "N/A"}
            </span>
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span>{AUD.format(row.getValue("salary"))}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "techStack",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tech stack" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {row
            .getValue("techStack")
            ?.split(",")
            .map((tech: string) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
        </div>
      );
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        key={`status-${row.original.id}`}
        variant="outline"
        className="capitalize"
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <DataTableRowActions row={row} actions={table.options?.meta?.actions} />
    ),
  },
];
