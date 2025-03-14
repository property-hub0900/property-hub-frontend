"use client";

import { IProperty } from "@/types/dashboard/properties";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";

export const columns: ColumnDef<IProperty>[] = [
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
  },
  {
    accessorKey: "propertyType",
    header: "Type",
    enableSorting: true,
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Email" />
    // ),
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
  },
  {
    accessorKey: "propertyId",
    header: "Action",
    cell: () => {
      return (
        <div className="flex gap-3 items-center">
          <Edit2 className="size-5 text-primary" />{" "}
          <Trash2 className="size-5 text-destructive" />
        </div>
      );
    },
  },
];
