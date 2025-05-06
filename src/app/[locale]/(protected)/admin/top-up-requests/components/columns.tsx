"use client";

import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IAdminPoints } from "@/types/protected/admin";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Button } from "@/components/ui/button";
import { AddPointsDialogue } from "./add-points-dialogue";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const columns = (): ColumnDef<IAdminPoints>[] => {
  const t = useTranslations("table");
  return [
    {
      accessorKey: "company.companyName",
      header: () => t("companyName"),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: () => t("email"),
      enableSorting: true,
    },
    {
      accessorKey: "phoneNumber",
      header: () => t("phoneNumber"),
      enableSorting: true,
    },
    {
      accessorKey: "points",
      header: () => t("topUpPoints"),
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: () => t("date"),
      enableSorting: true,
      cell: ({ row }) => {
        const { createdAt } = row.original;
        return <div className="capitalize">{formatDate(createdAt)}</div>;
      },
    },
    {
      accessorKey: "paymentMethod",
      header: () => t("paymentType"),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: () => t("status"),
      enableSorting: true,
      cell: ({ row }) => {
        const { status } = row.original;
        return (
          <>
            <StatusIndicator
              status={status}
              label={status}
              variant={"subtle"}
            />
          </>
        );
      },
    },
    {
      accessorKey: "transactionId",
      header: () => t("action"),
      enableSorting: false,
      cell: ({ row }) => <ActionCell data={row.original} />,
    },
  ];
};

const ActionCell = ({ data }: { data: IAdminPoints }) => {
  const t = useTranslations();
  const [isAddPointsDialogOpen, setIsAddPointsDialogOpen] = useState(false);

  const { status, transactionId, points } = data;

  return (
    <>
      {status === "pending" && (
        <Button
          size={"sm"}
          className="h-10 mt-5"
          type="button"
          onClick={() => setIsAddPointsDialogOpen(true)}
        >
          {t("button.addPoints")}
        </Button>
      )}
      <AddPointsDialogue
        points={points}
        transactionId={transactionId}
        isAddPointsDialogOpen={isAddPointsDialogOpen}
        setIsAddPointsDialogOpen={setIsAddPointsDialogOpen}
      />
    </>
  );
};
