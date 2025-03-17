"use client";

import { Loader } from "@/components/loader";
import { COMPANY_PATHS } from "@/constants/paths";
import { getErrorMessage } from "@/lib/utils";
import { deletePropertyById } from "@/services/dashboard/properties";
import { IProperty } from "@/types/dashboard/properties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const columns: ColumnDef<IProperty>[] = [
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
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
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
