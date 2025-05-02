"use client";

import { DataTable } from "@/components/dataTable/data-table";
import { formatDate, groupByThreeDigits, sortTableData } from "@/utils/utils";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { StatusIndicator } from "../ui/status-indicator";

// Define the Transaction interface based on used fields
interface Transaction {
    createdAt: string;
    points: number;
    paymentMethod: string;
    type: string;
    endDate: string;
}

export function TransactionHistory({ subscription }: { subscription: any }) {
    const t = useTranslations();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Update transactions when subscription changes
    useEffect(() => {
        setTransactions(subscription?.results || []);
    }, [subscription]);

    // Preprocess data to include computed fields for sorting
    const sortableTransactions = useMemo(() => {
        return transactions.map((transaction) => ({
            ...transaction,
            subscriptionDate: transaction.createdAt, // Alias for createdAt
            status: transaction.endDate && new Date(transaction.endDate) > new Date() ? "active" : "expired", // Computed status
        }));
    }, [transactions]);

    // Apply sorting to the data
    const sortedTransactions = useMemo(() => {
        if (sorting.length > 0) {
            const { id, desc } = sorting[0];
            return sortTableData(sortableTransactions, {
                field: id as keyof typeof sortableTransactions[0],
                direction: desc ? "desc" : "asc",
            });
        }
        return sortableTransactions;
    }, [sortableTransactions, sorting]);

    // Define columns
    const columns: ColumnDef<Transaction>[] = [
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
            // capitalize the first letter
            cell: ({ row }) => <span className="font-medium">{row?.original?.paymentMethod?.charAt(0)?.toUpperCase() + row?.original?.paymentMethod?.slice(1) || "-"}</span>,
        },
        {
            accessorKey: "type",
            header: t("type"),
            cell: ({ row }) => <span className="font-medium">{row?.original?.type?.charAt(0)?.toUpperCase() + row?.original?.type?.slice(1) || "-"}</span>,
            enableSorting: true,
        },
        {
            accessorKey: "endDate",
            header: t("subscriptionExpiryDate"),
            cell: ({ row }) => formatDate(row.original.endDate),
            enableSorting: true,
        },
        {
            accessorKey: "status",
            header: t("status"),
            cell: ({ row }) => {
                const isActive = row.original.endDate && new Date(row.original.endDate) > new Date();
                return (
                    <StatusIndicator
                        status={isActive ? "active" : "expired"}
                        label={isActive ? "Active" : "Expired"}
                        variant="subtle"
                    />
                );
            },
            enableSorting: true,
        },
    ];

    return (
        <div className="w-full">
            <DataTable
                columns={columns}
                data={sortedTransactions}
                sorting={sorting}
                onSortingChange={setSorting}
            />
        </div>
    );
}