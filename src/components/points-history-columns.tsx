"use client"

import { formatDate, groupByThreeDigits } from "@/utils/utils"
import type { ColumnDef } from "@tanstack/react-table"

// Define the data type for points history
export type PointsHistory = {
    createdAt: string
    id: string
    title: string
    actionType: string
    pointsReceived: number
    date: string
}

export const pointsHistoryColumns: ColumnDef<PointsHistory>[] = [
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
        accessorKey: "type",
        header: "Action Type",
        enableSorting: true,
        cell: ({ row }: any) => {
            return <span className="font-medium">{row?.original?.type?.charAt(0)?.toUpperCase() + row?.original?.type?.slice(1) || "-"}</span>
        }
    },
    {
        accessorKey: "points",
        header: "Points Received",
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
