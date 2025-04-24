"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import moment from "moment"
import { formatCurrency, formatDate, groupByThreeDigits } from "@/utils/utils"

export interface TopUpSubscription {
    date: Date
    points: number
    expires: string
    paymentMethod: string
    subscriptionExpiryDate: Date
    status: string
}

export function Columns() {
    const t = useTranslations("topUpSubscription")

    const columns: ColumnDef<TopUpSubscription>[] = [
        {
            accessorKey: "createdAt",
            header: t("columns.date"),
            cell: ({ row }: any) => {
                return formatDate(row.original.createdAt)
            },
        },
        {
            accessorKey: "points",
            header: t("columns.points"),
            cell: ({ row }: any) => {
                return groupByThreeDigits(row.original.points || 0)
            },
        },
        {
            accessorKey: "paymentMethod",
            header: t("columns.paymentMethod"),
        },
        {
            accessorKey: "type",
            header: t("columns.type"),
        },
    ]

    return columns
}

