"use client";

import { formatDateAndTime } from "@/utils/utils";

import { ColumnDef } from "@tanstack/react-table";

import { Edit } from "lucide-react";
import Link from "next/link";
import { ICustomer } from "./table";

export const Columns: ColumnDef<ICustomer>[] = [
  {
    accessorKey: "name",
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
    header: "Business Number",
    enableSorting: true,
  },
  {
    accessorKey: "listingsCount",
    header: "Listings Count",
    enableSorting: true,
  },
  {
    accessorKey: "points",
    header: "Points",
    enableSorting: true,
  },
  {
    accessorKey: "leads",
    header: "Leads",
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
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
  },

  {
    accessorKey: "searchId",
    header: "Action",
    cell: ({ row }) => {
      return (
        <>
          <Link
            target="_blank"
            href={`#`}
            className="flex items-center gap-1 text-primary"
          >
            <Edit className="size-5 text-primary" />
          </Link>
        </>
      );
    },
  },
];

// const ActionCell = ({ row }) => {
//   const rowData = row.original;
//   const { searchId, searchQuery } = rowData;

//   const queryClient = useQueryClient();

//   const deleteSaveSearchMutation = useMutation({
//     mutationKey: ["deleteSaveSearch"],
//     mutationFn: deleteSaveSearch,
//   });

//   const onDelete = async (id) => {
//     try {
//       const response = await deleteSaveSearchMutation.mutateAsync(id);
//       toast.success(response.message);
//       queryClient.refetchQueries({ queryKey: ["savedSearches"] });
//     } catch (error) {
//       toast.error(getErrorMessage(error));
//     }
//   };

//   return (
//     <>
//       <Loader isLoading={deleteSaveSearchMutation.isPending}></Loader>
//       <div className="flex gap-3 items-center">
//         <Link
//           target="_blank"
//           href={`${PUBLIC_ROUTES.properties}/${convertSavedSearchToURL(
//             searchQuery
//           )}`}
//           className="flex items-center gap-1 text-primary"
//         >
//           <Search className="size-5 text-primary" />
//           Run
//         </Link>
//         <Trash2
//           onClick={() => onDelete(searchId)}
//           className="size-5 text-destructive cursor-pointer"
//         />
//       </div>
//     </>
//   );
// };
