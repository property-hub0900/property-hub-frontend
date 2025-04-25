"use client";

import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IAdminPoints } from "@/types/protected/admin";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Button } from "@/components/ui/button";
import { AddPointsDialogue } from "./add-points-dialogue";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const Columns: ColumnDef<IAdminPoints>[] = [
  {
    accessorKey: "companyName",
    header: "Company Name",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    enableSorting: true,
  },
  {
    accessorKey: "points",
    header: "Top-Up Points",
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    enableSorting: true,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return <div className="capitalize">{formatDate(createdAt)}</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Type",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <>
          <StatusIndicator status={status} label={status} variant={"subtle"} />
        </>
      );
    },
  },
  {
    accessorKey: "transactionId",
    header: "Action",
    enableSorting: false,
    cell: ({ row }) => <ActionCell data={row.original} />,
  },
];

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
