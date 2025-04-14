/* eslint-disable no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/dataTable/data-table";
import type { StaffMember } from "@/services/protected/company";
import moment from "moment";
export function StaffTable({
  staff,
  onEdit,
  onDelete,
}: {
  staff: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
}) {
  const columns = [
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }: { row: any }) => {
        const firstName = row.original.firstName || "";
        const lastName = row.original.lastName || "";
        return <span>{`${firstName} ${lastName}`}</span>;
      },
    },
    {
      accessorKey: "role",
      header: "Type",
      cell: ({ row }: { row: any }) => (
        <span className="capitalize">{row.original.role}</span>
      ),
    },
    {
      accessorKey: "joinedDate",
      header: "Joined Date",
      cell: ({ row }: { row: any }) => {
        const date = row.original.createdAt;
        return date ? moment(date).format("YYYY-MM-DD") : "N/A";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        return (
          <span
            className={`capitalize px-2 py-1 rounded-full text-xs ${row.original.active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {row.original.active ? "Active" : "In-active"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            aria-label="Edit staff member"
          >
            <Pencil className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original)}
            aria-label="Delete staff member"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={staff} />;
}
