"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/utils"

// Define the data type for archived properties
export type ArchivedProperty = {
    createdAt: string
    id: string
    title: string
    pointsRefundable: number
    archivedDate: string
    afterPublish: string
    status: "active" | "refunded"
}

export const archivedPropertiesColumns: ColumnDef<ArchivedProperty>[] = [
    {
        accessorKey: "propertyId",
        header: "Property ID",
        enableSorting: true,
    },
    {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
    },
    {
        accessorKey: "points",
        header: "Points Refundable",
        enableSorting: true,
    },
    {
        accessorKey: "createdAt",
        header: "Archived Date",
        enableSorting: true,
        cell: ({ row }) => {
            return <span>{formatDate(row.original.createdAt)}</span>
        }
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
