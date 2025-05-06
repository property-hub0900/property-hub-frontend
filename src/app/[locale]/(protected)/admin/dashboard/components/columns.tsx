"use client";

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
      header: () => t("name"),
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
      accessorKey: "createdAt",
      header: () => t("registrationDate"),
      enableSorting: true,
      cell: ({ row }) => {
        const { createdAt } = row.original;
        return <div className="capitalize">{formatDate(createdAt)}</div>;
      },
    },

    {
      accessorKey: "companyId",
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
