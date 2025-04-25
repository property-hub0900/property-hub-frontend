"use client";

import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IAdminSubscription } from "@/types/protected/admin";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RenewSubscriptionDialogue } from "./renew-subscription-dialogue";

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
    header: "Date",
    enableSorting: true,
    cell: ({ row }) => {
      const { startDate } = row.original;
      return <div className="capitalize">{formatDate(startDate)}</div>;
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
  {
    accessorKey: "subscriptionId",
    header: "Action",
    enableSorting: false,
    cell: ({ row }) => <ActionCell data={row.original} />,
  },
];

const ActionCell = ({ data }: { data: IAdminSubscription }) => {
  const t = useTranslations();
  const [isRenewSubscriptionDialogOpen, setIsRenewSubscriptionDialogOpen] =
    useState(false);

  const { status, startDate, endDate, subscriptionId } = data;

  const isActive =
    new Date(startDate) <= new Date() && new Date(endDate) >= new Date();

  return (
    <>
      {!isActive && (
        <Button
          size={"sm"}
          className="h-10 mt-5"
          type="button"
          onClick={() => setIsRenewSubscriptionDialogOpen(true)}
        >
          {t("button.renewSubscription")}
        </Button>
      )}
      <RenewSubscriptionDialogue
        subscriptionId={subscriptionId}
        isRenewSubscriptionDialogOpen={isRenewSubscriptionDialogOpen}
        setIsRenewSubscriptionDialogOpen={setIsRenewSubscriptionDialogOpen}
      />
    </>
  );
};
