"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/utils"
import { RefundConfirmationDialog } from "./refund-confirmation-dialog"
import { useState } from "react"

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
        accessorKey: "property.title",
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
        accessorKey: "archivedays",
        header: "Archived After Publish",
        enableSorting: true,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const property: any = row.original
            const [isDialogOpen, setIsDialogOpen] = useState(false)
            const [refreshTrigger, setRefreshTrigger] = useState(0)

            const handleRefundSuccess = () => {
                // This will trigger a re-render of the component
                setRefreshTrigger((prev) => prev + 1)
            }

            return (
                <>
                    <Button
                        variant={property.status === "refunded" ? "secondary" : "default"}
                        size="sm"
                        disabled={property.status !== "pending"}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        {property.status === "refunded" ? "Refunded" : "Refund"}
                    </Button>

                    <RefundConfirmationDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        transactionId={property.transactionId}
                        propertyTitle={property.property.title}
                        points={property.points}
                        onSuccess={handleRefundSuccess}
                    />
                </>
            )

        },
    },
]
