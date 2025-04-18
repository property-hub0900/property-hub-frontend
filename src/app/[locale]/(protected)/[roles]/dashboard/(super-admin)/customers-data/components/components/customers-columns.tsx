"use client";

import { Loader } from "@/components/loader";

import { PUBLIC_ROUTES } from "@/constants/paths";
import {
  convertSavedSearchToURL,
  formatDateAndTime,
  getErrorMessage,
} from "@/utils/utils";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Search, Trash2 } from "lucide-react";

import Link from "next/link";
import { toast } from "sonner";
import { ISavedSearch } from "@/types/protected/properties";
import { deleteSaveSearch } from "@/services/protected/properties";

export const SavedSearchesColumns: ColumnDef<ISavedSearch>[] = [
  {
    accessorKey: "searchTitle",
    header: "Search Title",
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Date & Time",
    enableSorting: true,
    cell: ({ row }) => {
      const rowData = row.original;
      const { createdAt } = rowData;
      return <div className="capitalize">{formatDateAndTime(createdAt)}</div>;
    },
  },

  {
    accessorKey: "searchId",
    header: "Action",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

const ActionCell = ({ row }) => {
  const rowData = row.original;
  const { searchId, searchQuery } = rowData;

  const queryClient = useQueryClient();

  const deleteSaveSearchMutation = useMutation({
    mutationKey: ["deleteSaveSearch"],
    mutationFn: deleteSaveSearch,
  });

  const onDelete = async (id) => {
    try {
      const response = await deleteSaveSearchMutation.mutateAsync(id);
      toast.success(response.message);
      queryClient.refetchQueries({ queryKey: ["savedSearches"] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Loader isLoading={deleteSaveSearchMutation.isPending}></Loader>
      <div className="flex gap-3 items-center">
        <Link
          target="_blank"
          href={`${PUBLIC_ROUTES.properties}/${convertSavedSearchToURL(
            searchQuery
          )}`}
          className="flex items-center gap-1 text-primary"
        >
          <Search className="size-5 text-primary" />
          Run
        </Link>
        <Trash2
          onClick={() => onDelete(searchId)}
          className="size-5 text-destructive cursor-pointer"
        />
      </div>
    </>
  );
};
