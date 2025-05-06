"use client"

import { formatDate, groupByThreeDigits } from "@/utils/utils"
import type { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

// Define the data type for points history
export type PointsHistory = {
    createdAt: string
    id: string
    title: string
    actionType: string
    pointsReceived: number
    date: string
}

export const pointsHistoryColumns = (): ColumnDef<PointsHistory>[] => {
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
            accessorKey: "type",
            header: t("table.type"),
            enableSorting: true,
            cell: ({ row }: any) => {
                return <span className="font-medium">{row?.original?.type?.charAt(0)?.toUpperCase() + row?.original?.type?.slice(1) || "-"}</span>
            }
        },
        {
            accessorKey: "points",
            header: t("table.pointsReceived"),
            enableSorting: true,
            cell: ({ row }: any) => {
                return <span>{groupByThreeDigits(row.original.points || 0)}</span>
            }
        },
        {
            accessorKey: "createdAt",
            header: "Date",
            enableSorting: true,
            cell: ({ row }: any) => {
                return <span>{formatDate(row.original.createdAt)}</span>
            }
        },
    ]
}
