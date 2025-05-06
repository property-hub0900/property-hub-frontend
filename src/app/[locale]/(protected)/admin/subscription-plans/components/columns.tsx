"use client";

import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IAdminSubscription } from "@/types/protected/admin";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { useTranslations } from "next-intl";

export const columns = (): ColumnDef<IAdminSubscription>[] => {
  const t = useTranslations("table");
  return [
    {
      accessorKey: "company.companyName",
      header: () => t("companyName"),
      enableSorting: true,
    },
    {
      accessorKey: "company.companyEmail",
      header: () => t("email"),
      enableSorting: true,
    },
    {
      accessorKey: "points",
      header: () => t("points"),
      enableSorting: true,
    },
    {
      accessorKey: "startDate",
      header: () => t("subscriptionDate"),
      enableSorting: true,
      cell: ({ row }) => {
        const { startDate } = row.original;
        return <div className="capitalize">{formatDate(startDate)}</div>;
      },
    },

    {
      accessorKey: "endDate",
      header: () => t("subscriptionExpiryDate"),
      enableSorting: true,
      cell: ({ row }) => {
        const { endDate } = row.original;
        return <div className="capitalize">{formatDate(endDate)}</div>;
      },
    },

    {
      accessorKey: "status",
      header: () => t("status"),
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
};
