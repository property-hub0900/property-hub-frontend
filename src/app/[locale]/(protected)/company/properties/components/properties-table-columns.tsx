"use client";

import { DeleteDialog } from "@/components/delete-dailog";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { PROPERTY_STATUSES } from "@/constants/constants";
import { COMPANY_PATHS } from "@/constants/paths";
import { PERMISSIONS } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";
import {
  deletePropertyById,
  updatePropertyById,
} from "@/services/protected/properties";
import { IProperty } from "@/types/protected/properties";
import {
  formatAmountToQAR,
  formatDateAndTime,
  getErrorMessage,
} from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export const propertiesTableColumns = (): ColumnDef<IProperty>[] => {
  const t = useTranslations("table");
  console.log("propertiesTableColumns", JSON.stringify(t));
  return [
    {
      accessorKey: "referenceNo",
      header: t("refID"),
      enableSorting: true,
      cell: ({ row }) => {
        const rowData = row.original;
        const { propertyId } = rowData;
        return (
          <Link
            className="text-primary"
            href={`${COMPANY_PATHS.properties}/${propertyId}`}
          >
            {rowData.referenceNo}
          </Link>
        );
      },
    },
    {
      accessorKey: "title",
      header: t("title"),
      enableSorting: true,
    },
    {
      accessorKey: "postedByStaff.firstName",
      header: t("publisher"),
      enableSorting: true,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <>
            {rowData?.postedByStaff?.firstName}{" "}
            {rowData?.postedByStaff?.lastName}
          </>
        );
      },
    },

    {
      accessorKey: "propertyType",
      header: t("type"),
      enableSorting: true,
    },
    {
      accessorKey: "price",
      header: t("price"),
      enableSorting: true,
      cell: ({ row }) => {
        const { price } = row.original;
        return <>{formatAmountToQAR(price)}</>;
      },
    },
    {
      accessorKey: "createdAt",
      header: t("createdAt"),
      enableSorting: true,
      cell: ({ row }) => {
        const rowData = row.original;
        const { createdAt } = rowData;
        return <div className="capitalize">{formatDateAndTime(createdAt)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: t("status"),
      enableSorting: true,
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      accessorKey: "featured",
      header: t("upgradeProperty"),
      enableSorting: true,
      cell: ({ row }) => <FeaturedCell row={row} />,
    },
    {
      accessorKey: "propertyId",
      header: t("action"),
      cell: ({ row }) => <ActionCell row={row} />,
    },
  ];
};

// Rest of the code (StatusCell, FeaturedCell, ActionCell) remains unchanged
const StatusCell = ({ row }) => {
  const t = useTranslations();
  const { hasPermission } = useRBAC();
  const rowData = row.original;
  const { propertyId, status } = rowData;
  const queryClient = useQueryClient();
  const updatePropertyByIdMutation = useMutation({
    mutationKey: ["updatePropertyById"],
    mutationFn: updatePropertyById,
  });

  const handleApproveStatus = async () => {
    try {
      const updatedObj = {
        id: String(propertyId),
        payload: { status: PROPERTY_STATUSES.published },
      };
      const response = await updatePropertyByIdMutation.mutateAsync(updatedObj);
      toast.success(response.message);
      queryClient.refetchQueries({ queryKey: ["companiesProperties"] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex">
      {status === PROPERTY_STATUSES.pending &&
        hasPermission(PERMISSIONS.APPROVE_PROPERTY) ? (
        <Button
          disabled={updatePropertyByIdMutation.isPending}
          onClick={handleApproveStatus}
          size={"sm"}
        >
          {t("button.approve")}
        </Button>
      ) : (
        <div className="capitalize">{status}</div>
      )}
    </div>
  );
};

const FeaturedCell = ({ row }) => {
  const t = useTranslations();

  const { hasPermission } = useRBAC();
  const rowData = row.original;
  const { propertyId, featured, status } = rowData;
  const queryClient = useQueryClient();
  const updatePropertyByIdMutation = useMutation({
    mutationKey: ["updatePropertyById"],
    mutationFn: updatePropertyById,
  });

  const handleUpgradeFeatured = async () => {
    try {
      const updatedObj = {
        id: String(propertyId),
        payload: { featured: true },
      };
      const response = await updatePropertyByIdMutation.mutateAsync(updatedObj);
      toast.success(response.message);
      queryClient.refetchQueries({ queryKey: ["companiesProperties"] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex">
      {featured ? (
        <Button className="w-28" disabled variant={"outline"} size={"sm"}>
          <Image width={20} height={20} src="/star.svg" alt="Featured" />

          {t("button.featured")}
        </Button>
      ) : (
        <>
          {hasPermission(PERMISSIONS.FEATURE_PROPERTY) &&
            (status === PROPERTY_STATUSES.draft ||
              status === PROPERTY_STATUSES.published) && (
              <Button
                className="w-28"
                disabled={updatePropertyByIdMutation.isPending}
                onClick={handleUpgradeFeatured}
                size={"sm"}
              >
                {t("button.feature")}
              </Button>
            )}
        </>
      )}
    </div>
  );
};

const ActionCell = ({ row }) => {
  const t = useTranslations();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { propertyId, status } = row.original;
  const queryClient = useQueryClient();
  const updatePropertyByIdMutation = useMutation({
    mutationKey: ["updatePropertyById"],
    mutationFn: updatePropertyById,
  });

  const handleArchive = async () => {
    try {
      const updatedObj = {
        id: String(propertyId),
        payload: { status: PROPERTY_STATUSES.archived },
      };
      const response = await updatePropertyByIdMutation.mutateAsync(updatedObj);
      toast.success(response.message);
      queryClient.refetchQueries({ queryKey: ["companiesProperties"] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deletePropertyByIdMutation = useMutation({
    mutationKey: ["deletePropertyById"],
    mutationFn: deletePropertyById,
  });

  const handleDelete = async () => {
    try {
      const response = await deletePropertyByIdMutation.mutateAsync(propertyId);
      toast.success(response.message);
      queryClient.refetchQueries({ queryKey: ["companiesProperties"] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Loader isLoading={deletePropertyByIdMutation.isPending}></Loader>
      <div className="flex gap-3 items-center">
        <Link href={`${COMPANY_PATHS.properties}/${propertyId}`}>
          <Edit className="size-5 text-primary" />
        </Link>
        {status === PROPERTY_STATUSES.published && (
          <Archive
            onClick={handleArchive}
            className="size-5 text-muted-foreground cursor-pointer"
          />
        )}
        <Trash2
          onClick={() => setIsDeleteDialogOpen(true)}
          className="size-5 text-destructive cursor-pointer"
        />
        <DeleteDialog
          title={t("title.areYouSure")}
          deleteConfirmation={t("text.areYouSureText")}
          isSubmitting={false}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};