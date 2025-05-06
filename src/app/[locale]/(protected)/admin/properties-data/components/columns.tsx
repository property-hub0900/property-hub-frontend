"use client";

import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { ADMIN_PATHS } from "@/constants/paths";
import {
  deletePropertyById,
  updatePropertyById,
} from "@/services/protected/properties";
import { formatAmountToQAR, getErrorMessage } from "@/utils/utils";

import { PROPERTY_STATUSES } from "@/constants/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { DeleteDialog } from "@/components/delete-dailog";
import { IAdminProperty } from "@/types/protected/admin";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PERMISSIONS } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";

export const propertiesTableColumns = (): ColumnDef<IAdminProperty>[] => {
  const t = useTranslations("table");
  return [
    {
      accessorKey: "referenceNo",
      header: () => t("refID"),
      enableSorting: true,
      cell: ({ row }) => {
        const { propertyId, referenceNo } = row.original;
        return (
          <>
            <Link
              className="text-primary"
              href={`${ADMIN_PATHS.propertiesData}/${propertyId}`}
            >
              {referenceNo}
            </Link>
          </>
        );
      },
    },
    {
      accessorKey: "title",
      header: () => t("title"),
      enableSorting: true,
    },

    {
      accessorKey: "company.companyName",
      header: () => t("companyName"),
      enableSorting: true,
    },

    {
      accessorKey: "propertyType",
      header: () => t("type"),
      enableSorting: true,
    },
    {
      accessorKey: "price",
      header: () => t("price"),
      enableSorting: true,
      cell: ({ row }) => {
        const { price } = row.original;
        return <>{formatAmountToQAR(Number(price))}</>;
      },
    },

    {
      accessorKey: "status",
      header: () => t("status"),
      enableSorting: true,
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      accessorKey: "featured",
      header: () => t("featured"),
      enableSorting: true,
      cell: ({ row }) => <FeaturedCell row={row} />,
    },
    {
      accessorKey: "company.companyId",
      header: () => t("action"),
      cell: ({ row }) => <ActionCell row={row} />,
    },
  ];
};

const StatusCell = ({ row }) => {
  const rowData = row.original;
  const { status } = rowData;

  return (
    <div className="flex">
      <div className="capitalize">{status}</div>
    </div>
  );
};

const FeaturedCell = ({ row }) => {
  const { hasPermission } = useRBAC();
  const rowData = row.original;
  const { propertyId, featured, status } = rowData;

  const t = useTranslations();

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
      queryClient.refetchQueries({ queryKey: ["getAdminProperties"] });
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

  const rowData = row.original;
  const { propertyId, status } = rowData;

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
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAdminProperties"] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Loader isLoading={deletePropertyByIdMutation.isPending}></Loader>
      <div className="flex gap-3 items-center">
        <Link className="" href={`${ADMIN_PATHS.propertiesData}/${propertyId}`}>
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
