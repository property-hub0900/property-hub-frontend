"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import { formatCurrency, formatDate, formatPaymentMethod, groupByThreeDigits } from "@/utils/utils"

export interface TopUpSubscription {
    createdAt: string // Adjusted to match the accessorKey
    points: number
    paymentMethod: string
    type: string
    expires?: string
    subscriptionExpiryDate?: Date
    status?: string
}

export function Columns() {
    const t = useTranslations("topUpSubscription")

    const columns: ColumnDef<TopUpSubscription>[] = [
        {
            accessorKey: "createdAt",
            header: t("columns.date"),
            cell: ({ row }: any) => formatDate(row.original.createdAt),
            enableSorting: true, // Enable sorting
        },
        {
            accessorKey: "points",
            header: t("columns.points"),
            cell: ({ row }: any) => groupByThreeDigits(row.original.points || 0),
            enableSorting: true, // Enable sorting
        },
        {
            accessorKey: "paymentMethod",
            header: t("columns.paymentMethod"),
            enableSorting: true,
            cell: ({ row }: any) => <span className="font-medium">{formatPaymentMethod(row.original.paymentMethod)}</span>,
        },
        {
            accessorKey: "type",
            header: t("columns.type"),
            enableSorting: true,
            cell: ({ row }: any) => <span className="font-medium">{row?.original?.type?.charAt(0)?.toUpperCase() + row?.original?.type?.slice(1) || "-"}</span>,
        },
    ]

    return columns
}