import { useTranslations } from "next-intl";

// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   DoubleArrowLeftIcon,
//   DoubleArrowRightIcon} from "@radix-ui/react-icons";

import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize?: number;
}

export function DataTablePagination<TData>({
  table,
  pageSize = 10,
}: DataTablePaginationProps<TData>) {
  const t = useTranslations();
  // const lang = useAppSelector((state) => state.lang);
  // const isRTL = lang === "ur";

  const total = table.getPageCount();
  const current = table.getState().pagination.pageIndex + 1;
  const pageSizes = Array.from({ length: pageSize }, (_, i) => (i + 1) * pageSize);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
      </div>
      <div className="flex items-center gap-x-6">
        <div className="flex items-center gap-x-2">
          {/* <p className="text-sm font-medium">Rows per page</p> */}
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          {t("table.page")} {current} {t("table.of")} {total}
          {/* Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()} */}
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 flex min-w-0 border-grayDark"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ArrowLeftIcon className="h-4 w-4" />
            {/* {isRTL ? (
              <DoubleArrowRightIcon className="h-4 w-4" />
            ) : (
              <DoubleArrowLeftIcon className="h-4 w-4" />
            )} */}
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 min-w-0 border-grayDark"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
            {/* {isRTL ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )} */}
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 min-w-0 border-grayDark"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
            {/* {isRTL ? (
              <ChevronLeftIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )} */}
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 flex min-w-0 border-grayDark"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ArrowRightIcon className="h-4 w-4" />
            {/* {isRTL ? (
              <DoubleArrowLeftIcon className="h-4 w-4" />
            ) : (
              <DoubleArrowRightIcon className="h-4 w-4" />
            )} */}
          </Button>
        </div>
      </div>
    </div>
  );
}
