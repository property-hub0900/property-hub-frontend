"use client";

import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IAdminSubscription } from "@/types/protected/admin";
import { StatusIndicator } from "@/components/ui/status-indicator";

export const Columns: ColumnDef<IAdminSubscription>[] = [
  {
    accessorKey: "company.companyName",
    header: "Company Name",
    enableSorting: true,
  },
  {
    accessorKey: "company.companyEmail",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorKey: "points",
    header: "Points",
    enableSorting: true,
  },
  {
    accessorKey: "startDate",
    header: "Subscription Date",
    enableSorting: true,
    cell: ({ row }) => {
      const { startDate } = row.original;
      return <div className="capitalize">{formatDate(startDate)}</div>;
    },
  },

  {
    accessorKey: "endDate",
    header: "Subscription Expiry Date",
    enableSorting: true,
    cell: ({ row }) => {
      const { endDate } = row.original;
      return <div className="capitalize">{formatDate(endDate)}</div>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      const isActive =
        new Date(startDate) <= new Date() && new Date(endDate) >= new Date();

      const isActiveStatus = isActive ? "active" : "expired";

      return (
        <>
          <StatusIndicator
            status={isActiveStatus}
            label={isActiveStatus}
            variant={"subtle"}
          />
        </>
      );
    },
  },
];
