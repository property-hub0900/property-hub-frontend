"use client"

import { formatDate } from "@/utils/utils"
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
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
    },
    {
        accessorKey: "type",
        header: "Action Type",
        enableSorting: true,
    },
    {
        accessorKey: "points",
        header: "Points Received",
        enableSorting: true,
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        enableSorting: true,
        cell: ({ row }) => {
            return <span>{formatDate(row.original.createdAt)}</span>
        }
    },
]
