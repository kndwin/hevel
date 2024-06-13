import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/browser/ui/badge";
import { ExternalLinkIcon } from "lucide-react";

import { sentiments, statuses } from "./toolbar";
import { Applications } from "./row-actions";
import { DataTableColumnHeader } from "./column-header";
import { DataTableRowActions } from "./row-actions";
import { AUD } from "@/shared/utils/currency";

export const columns: ColumnDef<Applications>[] = [
  {
    accessorKey: "id",
    enableHiding: true,
  },
  {
    accessorKey: "sentiment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap space-x-2">
          <a
            href={row.original.sentiment}
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
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <Badge
          variant={
            ["expired", "rejected"].includes(status.value)
              ? "destructive"
              : "outline"
          }
          className="whitespace-pre"
        >
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "sentiment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sentiment" />
    ),
    cell: ({ row }) => {
      const sentiment = sentiments.find(
        (sentiment) => sentiment.value === row.getValue("sentiment")
      );

      if (!sentiment) {
        return null;
      }

      return <Badge variant="secondary">{sentiment.label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
