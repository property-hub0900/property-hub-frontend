"use client"

import type { ColumnDef } from "@tanstack/react-table"

// Define the data type for points history
export type PointsHistory = {
    id: string
    title: string
    actionType: string
    pointsReceived: number
    date: string
}

export const pointsHistoryColumns: ColumnDef<PointsHistory>[] = [
    {
        accessorKey: "id",
        header: "Property ID",
        enableSorting: true,
    },
    {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
    },
    {
        accessorKey: "actionType",
        header: "Action Type",
        enableSorting: true,
    },
    {
        accessorKey: "pointsReceived",
        header: "Points Received",
        enableSorting: true,
    },
    {
        accessorKey: "date",
        header: "Date",
        enableSorting: true,
    },
]
