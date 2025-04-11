"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

// Define the data type for archived properties
export type ArchivedProperty = {
    id: string
    title: string
    pointsRefundable: number
    archivedDate: string
    afterPublish: string
    status: "active" | "refunded"
}

export const archivedPropertiesColumns: ColumnDef<ArchivedProperty>[] = [
    {
        accessorKey: "id",
        header: "Property ID",
        enableSorting: true,
    },
    {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
    },
    {
        accessorKey: "pointsRefundable",
        header: "Points Refundable",
        enableSorting: true,
    },
    {
        accessorKey: "archivedDate",
        header: "Archived Date",
        enableSorting: true,
    },
    {
        accessorKey: "afterPublish",
        header: "After Publish",
        enableSorting: true,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const property = row.original

            return (
                <Button
                    variant={property.status === "refunded" ? "secondary" : "default"}
                    size="sm"
                    disabled={property.status === "refunded"}
                >
                    Refund
                </Button>
            )
        },
    },
]
