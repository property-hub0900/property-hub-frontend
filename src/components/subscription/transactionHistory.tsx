"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { DataTable } from "@/components/dataTable/data-table"
import type { ColumnDef } from "@tanstack/react-table"

interface Transaction {
    id: string
    date: string
    amount: number
    status: "successful" | "pending" | "failed"
    paymentMethod: string
    invoiceUrl?: string
}

export function TransactionHistory() {
    const t = useTranslations()
    const [sorting, setSorting] = useState([])

    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: "TX123456",
            date: "2023-12-01",
            amount: 199.99,
            status: "successful",
            paymentMethod: "Visa •••• 4242",
            invoiceUrl: "#",
        },
        {
            id: "TX123455",
            date: "2023-11-01",
            amount: 199.99,
            status: "successful",
            paymentMethod: "Visa •••• 4242",
            invoiceUrl: "#",
        },
        {
            id: "TX123454",
            date: "2023-10-01",
            amount: 199.99,
            status: "successful",
            paymentMethod: "Visa •••• 4242",
            invoiceUrl: "#",
        },
    ])

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: "id",
            header: t("transactionId"),
            cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
        },
        {
            accessorKey: "date",
            header: t("date"),
            cell: ({ row }) => formatDate(row.original.date),
            enableSorting: true,
        },
        {
            accessorKey: "amount",
            header: t("amount"),
            cell: ({ row }) => formatCurrency(row.original.amount),
            enableSorting: true,
        },
        {
            accessorKey: "status",
            header: t("status"),
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
            enableSorting: true,
        },
        {
            accessorKey: "paymentMethod",
            header: t("paymentMethod"),
            cell: ({ row }) => row.original.paymentMethod,
        },
        {
            accessorKey: "invoiceUrl",
            header: t("invoice"),
            cell: ({ row }) =>
                row.original.invoiceUrl && (
                    <a
                        href={row.original.invoiceUrl}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("view")}
                    </a>
                ),
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
    }

    const labels = {
        successful: t("statusSuccessful"),
        pending: t("statusPending"),
        failed: t("statusFailed"),
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

