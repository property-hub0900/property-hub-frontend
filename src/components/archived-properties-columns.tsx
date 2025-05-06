"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/utils"
import { RefundConfirmationDialog } from "./refund-confirmation-dialog"
import { useState } from "react"
import { useTranslations } from "next-intl"

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

export const archivedPropertiesColumns = (): ColumnDef<ArchivedProperty>[] => {
    const t = useTranslations()
    return [
        {
            accessorKey: "propertyId",
            header: t("table.propertyId"),
            enableSorting: true,
        },
        {
            accessorKey: "property.title",
            header: t("table.title"),
            enableSorting: true,
        },
        {
            accessorKey: "points",
            header: t("table.pointsRefundable"),
            enableSorting: true,
        },
        {
            accessorKey: "createdAt",
            header: t("table.date"),
            enableSorting: true,
            cell: ({ row }) => {
                return <span>{formatDate(row.original.createdAt)}</span>
            }
        },
        {
            accessorKey: "archivedays",
            header: t("table.archivedAfterPublish"),
            enableSorting: true,
        },
        {
            id: "actions",
            header: t("table.actions"),
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
                            {property.status === "refunded" ? t("button.refunded") : t("button.refund")}
                        </Button>

                        <RefundConfirmationDialog
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            transactionId={property?.transactionId}
                            propertyTitle={property?.property?.title}
                            points={property?.points}
                            onSuccess={handleRefundSuccess}
                        />
                    </>
                )

            },
        },
    ]
}
