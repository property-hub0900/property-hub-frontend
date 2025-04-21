"use client";

import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IAdminCustomer } from "@/types/protected/admin";

export const SavedSearchesColumns: ColumnDef<IAdminCustomer>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original;
      const { firstName, lastName } = rowData;
      return <div className="capitalize">{`${firstName} ${lastName}`}</div>;
    },
  },
  {
    accessorKey: "user.email",
    header: "Email",
    enableSorting: false,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original;
      const { createdAt } = rowData;
      return <div className="capitalize">{formatDate(createdAt)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const rowData = row.original;
      const { user } = rowData;
      const { status } = user;
      return (
        <div className="capitalize px-4 py-1.5 shadow-md rounded-md inline-flex gap-2 items-center">
          {status ? (
            <>
              <span className="inline-block size-2 bg-primary rounded-full"></span>
              Active
            </>
          ) : (
            <>
              <span className="inline-block size-2 bg-muted-foreground/60 rounded-full"></span>
              InActive
            </>
          )}
        </div>
      );
    },
  },
];
