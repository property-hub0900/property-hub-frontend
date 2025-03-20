"use client";

import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { COMPANY_PATHS } from "@/constants/paths";
import {
  formatAmountToQAR,
  formatDateAndTime,
  getErrorMessage,
} from "@/lib/utils";
import {
  deletePropertyById,
  updatePropertyById,
} from "@/services/dashboard/properties";
import { IProperty } from "@/types/dashboard/properties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export const agentPropertiesTableColumns: ColumnDef<IProperty>[] = [
  {
    accessorKey: "referenceNo",
    header: "Ref ID",
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
    header: "Title",
    enableSorting: true,
  },
  {
    accessorKey: "propertyType",
    header: "Type",
    enableSorting: true,
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Email" />
    // ),
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
    cell: ({ row }) => {
      const { price } = row.original;

      return <>{formatAmountToQAR(price)}</>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original;
      const { createdAt } = rowData;
      return <div className="capitalize">{formatDateAndTime(createdAt)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original;
      const { status } = rowData;
      return <div className="capitalize">{status}</div>;
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original;
      const { propertyId, featured } = rowData;

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

          const response = await updatePropertyByIdMutation.mutateAsync(
            updatedObj
          );
          toast.success(response.message);
          queryClient.refetchQueries({ queryKey: ["companiesProperties"] });
        } catch (error) {
          toast.error(getErrorMessage(error));
        }
      };

      return (
        <div className="flex justify-center w-[80px]">
          {featured ? (
            <Image width={20} height={20} src="/star.svg" alt="PropertyHub" />
          ) : (
            <Button
              disabled={updatePropertyByIdMutation.isPending}
              onClick={handleUpgradeFeatured}
              size={"sm"}
            >
              Upgrade
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "propertyId",
    header: "Action",
    cell: ({ row }) => {
      const rowData = row.original;
      const { propertyId } = rowData;

      const queryClient = useQueryClient();

      const deletePropertyByIdMutation = useMutation({
        mutationKey: ["deletePropertyById"],
        mutationFn: deletePropertyById,
      });

      const onDelete = async (id) => {
        try {
          const response = await deletePropertyByIdMutation.mutateAsync(id);
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
              <Edit2 className="size-5 text-primary" />
            </Link>
            <Trash2
              onClick={() => onDelete(propertyId)}
              className="size-5 text-destructive cursor-pointer"
            />
          </div>
        </>
      );
    },
  },
];
