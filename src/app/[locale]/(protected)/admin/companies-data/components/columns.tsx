"use client";

import { ADMIN_PATHS } from "@/constants/paths";
import { ICompanyAdmin } from "@/types/protected/admin";
import { formatDate } from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import Link from "next/link";

export const Columns: ColumnDef<ICompanyAdmin>[] = [
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
    accessorKey: "phone",
    header: "Business Number",
    enableSorting: true,
  },
  {
    accessorKey: "listingCount",
    header: "Listing Count",
    enableSorting: true,
  },
  {
    accessorKey: "sharedPoints",
    header: "Points",
    enableSorting: true,
  },
  {
    accessorKey: "leadCount",
    header: "Leads",
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    enableSorting: true,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return <div className="capitalize">{formatDate(createdAt)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="capitalize px-4 py-1.5 shadow-md rounded-md inline-flex gap-2 items-center">
          <span
            className={`inline-block size-2 rounded-full ${
              status === "active" ? "bg-primary" : "bg-muted-foreground/60"
            }`}
          ></span>
          {status}
        </div>
      );
    },
  },

  {
    accessorKey: "searchId",
    header: "Action",
    cell: ({ row }) => {
      const { companyId } = row.original;
      return (
        <>
          <Link
            href={`${ADMIN_PATHS.companiesData}/${companyId}`}
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
