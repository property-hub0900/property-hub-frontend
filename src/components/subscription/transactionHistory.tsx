"use client";

import { DataTable } from "@/components/dataTable/data-table";
import { formatDate, groupByThreeDigits, sortTableData } from "@/utils/utils";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { StatusIndicator } from "../ui/status-indicator";

// Transaction interface (consistent with parent)
interface Transaction {
    subscriptionId: number;
    createdAt: string;
    points: number;
    paymentMethod: string;
    type: string;
    endDate?: string;
    status?: string;
}

export function TransactionHistory({ subscription }: { subscription: Transaction[] }) {
    const t = useTranslations();
    const [sorting, setSorting] = useState<SortingState>([]);

    // Use subscription directly as transactions (already an array)
    const transactions = subscription || [];

    // Preprocess data for sorting with computed fields
    const sortableTransactions = useMemo(() => {
        return transactions.map((transaction) => ({
            ...transaction,
            subscriptionDate: transaction.createdAt,
            computedStatus:
                transaction.status === "pending"
                    ? "pending"
                    : transaction.endDate && new Date(transaction.endDate) > new Date()
                        ? "active"
                        : "expired",
        }));
    }, [transactions]);

    // Apply sorting
    const sortedTransactions = useMemo(() => {
        if (sorting.length === 0) return sortableTransactions;
        const { id, desc } = sorting[0];
        return sortTableData(sortableTransactions, {
            field: id as keyof typeof sortableTransactions[0],
            direction: desc ? "desc" : "asc",
        });
    }, [sortableTransactions, sorting]);

    // Define columns
    const columns: ColumnDef<Transaction & { computedStatus?: string }>[] = [
        {
            accessorKey: "subscriptionDate",
            header: t("subscriptionDate"),
            cell: ({ row }) => <span className="font-medium">{formatDate(row.original.createdAt)}</span>,
            enableSorting: true,
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
            enableSorting: false,
            cell: ({ row }) =>
                row.original.paymentMethod ? (
                    <span className="font-medium">
                        {row.original.paymentMethod.charAt(0).toUpperCase() + row.original.paymentMethod.slice(1)}
                    </span>
                ) : (
                    "-"
                ),
        },
        {
            accessorKey: "type",
            header: t("type"),
            cell: ({ row }) =>
                row.original.type ? (
                    <span className="font-medium">{row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}</span>
                ) : (
                    "-"
                ),
            enableSorting: true,
        },
        {
            accessorKey: "endDate",
            header: t("subscriptionExpiryDate"),
            cell: ({ row }) => (row.original.endDate ? formatDate(row.original.endDate) : "-"),
            enableSorting: true,
        },
        {
            accessorKey: "computedStatus",
            header: t("status"),
            cell: ({ row }) => {
                const { status, endDate } = row.original;
                let statusType: "pending" | "active" | "expired";
                let statusLabel: string;

                if (status === "pending") {
                    statusType = "pending";
                    statusLabel = t("form.status.options.pending");
                } else if (endDate && new Date(endDate) > new Date()) {
                    statusType = "active";
                    statusLabel = t("form.status.options.active");
                } else {
                    statusType = "expired";
                    statusLabel = t("form.status.options.expired");
                }

                return <StatusIndicator status={statusType} label={statusLabel} variant="subtle" />;
            },
            enableSorting: true,
        },
    ];

    return (
        <div className="w-full">
            <DataTable columns={columns} data={sortedTransactions} sorting={sorting} onSortingChange={setSorting} />
        </div>
    );
}