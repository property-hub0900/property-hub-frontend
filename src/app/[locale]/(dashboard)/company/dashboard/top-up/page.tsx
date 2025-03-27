"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { PlusCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Columns } from "./columns"
import { Loader } from "@/components/loader"
import { DataTable } from "@/components/dataTable/data-table"
import { TopUpForm } from "./top-up-form"
import { companyService } from "@/services/company"
import { getErrorMessage } from "@/lib/utils"

// Sample data for development/fallback
const topUpData = [
    {
        id: "1",
        date: new Date("2025-03-10"),
        points: 10,
        expires: "10 Days",
        paymentMethod: "Credit/Debit",
        subscriptionExpiryDate: new Date("2025-04-10"),
        status: "Paid",
    },
    {
        id: "2",
        date: new Date("2025-03-15"),
        points: 30,
        expires: "7 Days",
        paymentMethod: "Sofort/Klarna",
        subscriptionExpiryDate: new Date("2025-04-12"),
        status: "Cancelled",
    },
    {
        id: "3",
        date: new Date("2025-03-18"),
        points: 25,
        expires: "2 Days",
        paymentMethod: "Credit/Debit",
        subscriptionExpiryDate: new Date("2025-04-14"),
        status: "Paid",
    },
    {
        id: "4",
        date: new Date("2025-03-20"),
        points: 50,
        expires: "14 Days",
        paymentMethod: "PayPal",
        subscriptionExpiryDate: new Date("2025-04-20"),
        status: "Pending",
    },
    {
        id: "5",
        date: new Date("2025-03-22"),
        points: 15,
        expires: "5 Days",
        paymentMethod: "Credit/Debit",
        subscriptionExpiryDate: new Date("2025-04-22"),
        status: "Paid",
    },
]

export default function TopUpSubscriptionPage() {
    // Always declare all hooks at the top level, never conditionally
    const t = useTranslations("topUpSubscription")
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
    const [showTopUpForm, setShowTopUpForm] = useState(false)
    const [topUpHistory, setTopUpHistory] = useState(topUpData)
    const [topUpPlans, setTopUpPlans] = useState<any[]>([])

    // Fetch top-up history (this would be a real API call in production)
    const { isLoading: isLoadingHistory } = useQuery({
        queryKey: ["topUpHistory"],
        queryFn: async () => {
            try {
                // In a real app, you would fetch the history from an API
                // For now, we'll use the sample data
                setTopUpHistory(topUpData)
                return topUpData
            } catch (error) {
                console.error("Failed to fetch top-up history:", error)
                toast.error(getErrorMessage(error))
                return topUpData
            }
        },
    })

    // Fetch top-up plans
    const { isLoading: isLoadingPlans } = useQuery({
        queryKey: ["topUpPlans"],
        queryFn: async () => {
            try {
                const response: any = await companyService.getTopUpPlans()
                if (response.results) {
                    setTopUpPlans(response.results)
                }
                return response.results
            } catch (error) {
                console.error("Failed to fetch top-up plans:", error)
                toast.error(getErrorMessage(error))
                return []
            }
        },
    })

    // Filter data based on status
    const filteredData = statusFilter
        ? topUpHistory.filter((item) => item.status.toLowerCase() === statusFilter.toLowerCase())
        : topUpHistory

    const isLoading = isLoadingHistory || isLoadingPlans

    // Always render both components but conditionally show/hide them
    // This ensures hooks are always called in the same order
    return (
        <div className="container px-4 sm:px-6 py-6 space-y-6 max-w-full">
            <Loader isLoading={isLoading} />
            <Separator className="mb-6" />

            <div style={{ display: showTopUpForm ? "none" : "block" }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">{t("history")}</h1>
                    <Button onClick={() => setShowTopUpForm(true)} className="self-start sm:self-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t("addNew")}
                    </Button>
                </div>

                <div className="rounded-md border overflow-x-auto">
                    <div className="flex justify-end p-4">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t("selectStatus")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={undefined as any}>{t("allStatuses")}</SelectItem>
                                <SelectItem value="paid">{t("statusPaid")}</SelectItem>
                                <SelectItem value="pending">{t("statusPending")}</SelectItem>
                                <SelectItem value="cancelled">{t("statusCancelled")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <DataTable
                            columns={Columns() as any}
                            data={filteredData}
                            rowClassName={(row) => {
                                if (row.status.toLowerCase() === "cancelled") return "bg-red-50/50 dark:bg-red-950/20"
                                if (row.status.toLowerCase() === "pending") return "bg-yellow-50/50 dark:bg-yellow-950/20"
                                return ""
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: showTopUpForm ? "block" : "none" }}>
                <TopUpForm onCancel={() => setShowTopUpForm(false)} plans={topUpPlans} />
            </div>
        </div>
    )
}

