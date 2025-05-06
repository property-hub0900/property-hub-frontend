/* eslint-disable no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/dataTable/data-table";
import type { StaffMember } from "@/services/protected/company";
import moment from "moment";
import { PERMISSIONS } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";
import { StatusIndicator } from "./ui/status-indicator";
import { useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { sortTableData } from "@/utils/utils";
import { useTranslations } from "next-intl";

export function StaffTable({
  staff,
  onEdit,
  onDelete,
  title,
}: {
  staff: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
  title: string;
}) {
  const { hasPermission } = useRBAC();
  const [sorting, setSorting] = useState<SortingState>([]);

  const t = useTranslations();

  let columns = [
    {
      accessorKey: "fullName",
      header: t("table.fullName"),
      cell: ({ row }: { row: any }) => {
        const firstName = row.original.firstName || "";
        const lastName = row.original.lastName || "";
        return <span>{`${firstName} ${lastName}`}</span>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: t("table.type"),
      cell: ({ row }: { row: any }) => (
        <span className="capitalize">
          {row.original.role === "manager" ? "Admin" : row.original.role}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "joinedDate",
      header: t("table.joinedDate"),
      cell: ({ row }: { row: any }) => {
        const date = row.original.createdAt;
        return date ? moment(date).format("YYYY-MM-DD") : "N/A";
      },
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      cell: ({ row }: { row: any }) => {
        return (
          <StatusIndicator
            status={row.original.active ? "active" : "inactive"}
            label={row.original.active ? "active" : "In-active"}
            variant={"subtle"}
            className="capitalize"
          />
        );

      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: t("table.actions"),
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          {hasPermission(PERMISSIONS.EDIT_USER) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              aria-label="Edit staff member"
            >
              <Pencil className="h-4 w-4 text-primary" />
            </Button>
          )}
          {hasPermission(PERMISSIONS.DELETE_USER) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(row.original)}
              aria-label="Delete staff member"
              disabled
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
      enableSorting: false,
    },
  ];

  if (
    !hasPermission(PERMISSIONS.EDIT_USER) &&
    !hasPermission(PERMISSIONS.DELETE_USER)
  ) {
    columns = columns.filter((column) => column.id !== "actions");
  }

  // Preprocess data to include computed fields for sorting
  const sortableData = useMemo(() => {
    return staff.map((item) => {
      return {
        ...item,
        fullName: `${item.firstName || ""} ${item.lastName || ""}`.trim(), // Computed fullName
        sortableRole: item.role === "manager" ? "admin" : item.role, // Map manager to admin
        joinedDate: item.createdAt, // Alias for createdAt
        status: item.active ? "active" : "inactive",
      };
    });
  }, [staff]);

  // Apply sorting to the data
  const sortedData = useMemo(() => {
    // sort with status what should we do 
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];

      // Map column accessorKey to the corresponding field in sortableData
      const fieldMap: { [key: string]: keyof typeof sortableData[0] } = {
        fullName: "fullName",
        role: "sortableRole",
        joinedDate: "joinedDate",
        status: "status",
      };
      const sortField = fieldMap[id] || id;
      return sortTableData(sortableData, {
        field: sortField,
        direction: desc ? "desc" : "asc",
      });
    }
    return sortableData;
  }, [sortableData, sorting]);

  // Handle sorting state changes
  const handleSortingChange = (
    updaterOrValue: SortingState | ((prev: SortingState) => SortingState)
  ) => {
    setSorting(updaterOrValue);
  };

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={sortedData}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        search={true}
        title={title}
        searchingParams={["fullName", "role", "joinedDate", "status"]}
      />
    </div>
  );
}