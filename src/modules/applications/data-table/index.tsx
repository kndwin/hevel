import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Actions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/browser/ui/table";

import { DataTablePagination } from "./pagination";
import { DataTableToolbar, statuses } from "./toolbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/browser/ui/card";
import { Badge } from "@/shared/browser/ui/badge";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions: Actions;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  actions,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ id: false });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      actions,
    },
  });

  return (
    <div className="space-y-4 flex-1 w-full">
      <DataTableToolbar table={table} />
      <div className="rounded-md border hidden lg:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="rounded-md lg:hidden flex flex-col gap-2">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Card
              onClick={() =>
                table.options.meta?.actions.view(row.getValue("id"))
              }
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              <CardHeader>
                <CardTitle className="w-fit">
                  {row.getValue("title") || "N/A"}
                </CardTitle>
                <CardDescription className="flex justify-between">
                  <span>{row.getValue("company")}</span>
                </CardDescription>
                {(() => {
                  const status = statuses.find(
                    (status) => status.value === row.getValue("status")
                  );
                  return (
                    <Badge className="w-fit" variant="outline">
                      {status?.label}
                    </Badge>
                  );
                })()}
                <CardDescription className="flex justify-between">
                  <span>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "AUD",
                      compactDisplay: "short",
                    }).format(row.getValue("salary"))}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card>No results.</Card>
        )}
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
