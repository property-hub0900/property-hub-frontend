"use client";

import { StatusIndicator } from "@/components/ui/status-indicator";
import { ADMIN_PATHS } from "@/constants/paths";
import { ICompanyAdmin } from "@/types/protected/admin";
import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const columns = (): ColumnDef<ICompanyAdmin>[] => {
  const t = useTranslations("table");
  return [
    {
      accessorKey: "name",
      header: () => t("companyName"),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: () => t("email"),
      enableSorting: true,
    },
    {
      accessorKey: "phone",
      header: () => t("businessNumber"),
      enableSorting: true,
    },
    {
      accessorKey: "listingCount",
      header: () => t("listingCount"),
      enableSorting: true,
    },
    {
      accessorKey: "sharedPoints",
      header: () => t("points"),
      enableSorting: true,
    },
    {
      accessorKey: "leadCount",
      header: () => t("leads"),
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: () => t("registrationDate"),
      enableSorting: true,
      cell: ({ row }) => {
        const { createdAt } = row.original;
        return <div className="capitalize">{formatDate(createdAt)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: () => t("status"),
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <StatusIndicator status={status} label={status} variant={"subtle"} />
        );
      },
    },

    {
      accessorKey: "searchId",
      header: () => t("action"),
      cell: ({ row }) => {
        const { companyId } = row.original;
        return (
          <>
            <Link
              href={`${ADMIN_PATHS.companiesData}/${companyId}`}
              className="flex items-center gap-1 text-primary"
            >
              <Edit className="size-5 text-primary" />
            </Link>
          </>
        );
      },
    },
  ];
};
