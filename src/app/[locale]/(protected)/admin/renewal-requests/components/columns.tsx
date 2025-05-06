"use client";

import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IAdminSubscription } from "@/types/protected/admin";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RenewSubscriptionDialogue } from "./renew-subscription-dialogue";

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
      accessorKey: "company.companyPhone",
      header: () => t("phoneNumber"),
      enableSorting: true,
    },
    {
      accessorKey: "points",
      header: () => t("renewalPoints"),
      enableSorting: true,
    },
    {
      accessorKey: "startDate",
      header: () => t("date"),
      enableSorting: true,
      cell: ({ row }) => {
        const { startDate } = row.original;
        return <div className="capitalize">{formatDate(startDate)}</div>;
      },
    },
    {
      accessorKey: "subscriptionId",
      header: () => t("action"),
      enableSorting: false,
      cell: ({ row }) => <ActionCell data={row.original} />,
    },
  ];
};

const ActionCell = ({ data }: { data: IAdminSubscription }) => {
  const t = useTranslations();
  const [isRenewSubscriptionDialogOpen, setIsRenewSubscriptionDialogOpen] =
    useState(false);

  const { subscriptionId, paymentImage } = data;

  return (
    <>
      <Button
        size={"sm"}
        className="h-10 mt-5"
        type="button"
        onClick={() => setIsRenewSubscriptionDialogOpen(true)}
      >
        {t("button.renewSubscription")}
      </Button>

      <RenewSubscriptionDialogue
        subscriptionId={subscriptionId}
        paymentImage={paymentImage}
        isRenewSubscriptionDialogOpen={isRenewSubscriptionDialogOpen}
        setIsRenewSubscriptionDialogOpen={setIsRenewSubscriptionDialogOpen}
      />
    </>
  );
};
