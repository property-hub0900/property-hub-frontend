"use client";

import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ICustomerAdmin } from "@/types/protected/admin";
import { useTranslations } from "next-intl";

export const columns = (): ColumnDef<ICustomerAdmin>[] => {
  const t = useTranslations("table");
  return [
    {
      accessorKey: "firstName",
      header: () => t("name"),
      enableSorting: true,
      cell: ({ row }) => {
        const { firstName, lastName } = row.original;
        return <div className="capitalize">{`${firstName} ${lastName}`}</div>;
      },
    },
    {
      accessorKey: "user.email",
      header: () => t("email"),
      enableSorting: true,
    },
    {
      accessorKey: "phoneNumber",
      header: () => t("phoneNumber"),
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
      enableSorting: false,
      cell: ({ row }) => {
        const status = row.original.user.status;
        const t = useTranslations();
        return (
          <div className="capitalize px-4 py-1.5 shadow-md rounded-md inline-flex gap-2 items-center">
            <span
              className={`inline-block size-2 rounded-full ${
                status ? "bg-primary" : "bg-muted-foreground/60"
              }`}
            ></span>
            {status
              ? `${t("form.status.options.active")}`
              : `${t("form.status.options.inactive")}`}
          </div>
        );
      },
    },
  ];
};
