"use client"

import { DataTable } from "@/components/dataTable/data-table"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { StatusIndicator } from "../ui/status-indicator"
import { groupByThreeDigits } from "@/utils/utils"



export function TransactionHistory({ subscription }: { subscription: any }) {
    const t = useTranslations()
    const [sorting, setSorting] = useState([])
    const [transactions, setTransactions] = useState<Transaction[]>([]);


    useEffect(() => {
        setTransactions(subscription?.results || []);
    }, [subscription]);

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: "subscriptionDate",
            header: t("subscriptionDate"),
            cell: ({ row }) => <span className="font-medium">{formatDate(row?.original?.createdAt as string)}</span>,
        },
        {
            accessorKey: "points",
            header: t("points"),
            cell: ({ row }) => <span className="font-medium">{groupByThreeDigits(row.original.points || 0)}</span>,
            enableSorting: true,
        },
        {
            accessorKey: "paymentMethod",
            header: t("method"),
        },
        {
            accessorKey: "type",
            header: t("type"),
            cell: ({ row }) => <span className="font-medium">{row.original.type}</span>,
            enableSorting: true,
        },
        {
            accessorKey: "endDate",
            header: t("subscriptionExpiryDate"),
            cell: ({ row }) => formatDate(row.original.endDate as string),
        },
        {
            accessorKey: "status",
            header: t("status"),
            cell: ({ row }) => {
                if (row.original?.endDate && new Date(row.original?.endDate) > new Date()) {
                    return <StatusIndicator status={"active"} label={"Active"} variant={"subtle"} />
                } else {
                    return <StatusIndicator status={"expired"} label={"Expired"} variant={"subtle"} />
                }
            },
        },
    ]

    return (
        <div className="w-full">
            <DataTable columns={columns} data={transactions} sorting={sorting} onSortingChange={setSorting as any} />
        </div>
    )
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
    const t = useTranslations()

    const variants = {
        successful: "bg-green-100 text-green-800 hover:bg-green-100",
        pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        failed: "bg-red-100 text-red-800 hover:bg-red-100",
        active: "bg-green-100 text-green-800 hover:bg-green-100",
        expired: "bg-red-100 text-red-800 hover:bg-red-100",
    }

    const labels = {
        successful: t("statusSuccessful"),
        pending: t("statusPending"),
        failed: t("statusFailed"),
        active: t("statusActive"),
        expired: t("statusExpired"),
    }

    return (
        <Badge className={variants[status]} variant="outline">
            {labels[status]}
        </Badge>
    )
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

