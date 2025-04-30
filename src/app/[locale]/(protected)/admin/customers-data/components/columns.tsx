"use client";

import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ICustomerAdmin } from "@/types/protected/admin";

export const Columns: ColumnDef<ICustomerAdmin>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    enableSorting: true,
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return <div className="capitalize">{`${firstName} ${lastName}`}</div>;
    },
  },
  {
    accessorKey: "user.email",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    enableSorting: true,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return <div className="capitalize">{formatDate(createdAt)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.user.status;
      return (
        <div className="capitalize px-4 py-1.5 shadow-md rounded-md inline-flex gap-2 items-center">
          <span
            className={`inline-block size-2 rounded-full ${
              status ? "bg-primary" : "bg-muted-foreground/60"
            }`}
          ></span>
          {status ? "Active" : "Inactive"}
        </div>
      );
    },
  },
];
