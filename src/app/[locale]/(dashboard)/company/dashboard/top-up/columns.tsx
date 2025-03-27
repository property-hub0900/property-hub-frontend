"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import moment from "moment"
import { Badge } from "@/components/ui/badge"

export type TopUpSubscription = {
    id: string
    date: Date
    points: number
    expires: string
    paymentMethod: string
    subscriptionExpiryDate: Date
    status: "Paid" | "Pending" | "Cancelled"
}

export function Columns() {
    const t = useTranslations("topUpSubscription.columns")

    const columns: ColumnDef<TopUpSubscription>[] = [
        {
            accessorKey: "date",
            header: t("date"),
            cell: ({ row }) => {
                const date = row.getValue("date") as Date
                return moment(date).format("MMM DD, YYYY")
            },
        },
        {
            accessorKey: "points",
            header: t("points"),
        },
        {
            accessorKey: "expires",
            header: t("expires"),
        },
        {
            accessorKey: "paymentMethod",
            header: t("paymentMethod"),
        },
        {
            accessorKey: "subscriptionExpiryDate",
            header: t("subscriptionExpiryDate"),
            cell: ({ row }) => {
                const date = row.getValue("subscriptionExpiryDate") as Date
                return moment(date).format("MMM DD, YYYY")
            },
        },
        {
            accessorKey: "status",
            header: t("status"),
            cell: ({ row }) => {
                const status = row.getValue("status") as string

                return (
                    <Badge
                        variant={
                            status.toLowerCase() === "paid"
                                ? "success"
                                : status.toLowerCase() === "pending"
                                    ? "warning"
                                    : ("destructive" as any)
                        }
                        className="capitalize"
                    >
                        {status}
                    </Badge>
                )
            },
        },
    ]

    return columns
}

