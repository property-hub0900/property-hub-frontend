"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import moment from "moment"

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
            accessorKey: "date",
            header: t("columns.date"),
            cell: ({ row }) => {
                const date = row.getValue("date") as Date
                return moment(date).format("MMM DD, YYYY")
            },
        },
        {
            accessorKey: "points",
            header: t("columns.points"),
        },
        {
            accessorKey: "expires",
            header: t("columns.expires"),
        },
        {
            accessorKey: "paymentMethod",
            header: t("columns.paymentMethod"),
        },
        {
            accessorKey: "subscriptionExpiryDate",
            header: t("columns.subscriptionExpiryDate"),
            cell: ({ row }) => {
                const date = row.getValue("subscriptionExpiryDate") as Date
                return moment(date).format("MMM DD, YYYY")
            },
        },
        {
            accessorKey: "status",
            header: t("columns.status"),
            cell: ({ row }) => {
                const status = row.getValue("status") as string

                return (
                    <div className="flex items-center">
                        <span
                            className={`h-2 w-2 rounded-full mr-2 ${status.toLowerCase() === "paid"
                                ? "bg-green-500"
                                : status.toLowerCase() === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                        />
                        <span>{status}</span>
                    </div>
                )
            },
        },
    ]

    return columns
}

