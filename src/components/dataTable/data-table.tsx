/* eslint-disable no-unused-vars */
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { DataTablePagination } from "./data-table-pagination";

//import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  sorting?: SortingState;
  onSortingChange?: (
    updaterOrValue: SortingState | ((prev: SortingState) => SortingState)
  ) => void;
  rowClassName?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting,
  onSortingChange,
  rowClassName,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const t = useTranslations();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableSorting: false,
  });

  return (
    <div className="space-y-8">
      {/* <DataTableToolbar table={table} /> */}
      <div className="">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort =
                    header.column.columnDef.enableSorting === true;

                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2">
                          {canSort ? (
                            <Button
                              variant="link"
                              size="sm"
                              className="-ms-3 h-8 data-[state=open]:bg-accent text-foreground hover:no-underline"
                              onClick={() => header.column.toggleSorting()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: <ChevronUp className="ms-2 h-4 w-4" />,
                                desc: <ChevronDown className="ms-2 h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? (
                                  <ChevronsUpDown className="ms-2 h-4 w-4" />
                                )}
                            </Button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                        </div>
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
                  className={rowClassName ? rowClassName(row.original) : ""}
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
                <TableCell colSpan={columns.length} className=" text-center">
                  {t("table.notFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data.length > 1 && <DataTablePagination table={table} />}
    </div>
  );
}
