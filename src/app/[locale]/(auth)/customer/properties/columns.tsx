"use client";

import { IProperty } from "@/types/dashboard/properties";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";

export const columns: ColumnDef<IProperty>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "propertyType",
    header: "Type",
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Email" />
    // ),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
  },
  {
    accessorKey: "status",
    header: "Status",
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
