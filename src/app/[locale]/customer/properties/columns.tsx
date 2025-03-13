"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";

export type IPropertiesListing = {
  id: string;
  title: string;
  type: string;
  price: number;
  lastUpdated: string;
  status: string;
  Action: string;
};

export const columns: ColumnDef<IPropertiesListing>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "type",
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
    accessorKey: "id",
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
