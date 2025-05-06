"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { DataTable } from "@/components/dataTable/data-table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SortingState } from "@tanstack/react-table"
import { pointsHistoryColumns } from "@/components/points-history-columns"
import { archivedPropertiesColumns } from "@/components/archived-properties-columns"
import { useAuthStore } from "@/store/auth-store"
import { formatDate, getErrorMessage, groupByThreeDigits } from "@/utils/utils"
import { useQuery } from "@tanstack/react-query"
import { companyService } from "@/services/protected/company"
import { toast } from "sonner"

export default function PointsPage() {
    const t = useTranslations();
    // State for sorting and search
    const [pointsHistorySorting, setPointsHistorySorting] = useState<SortingState>([])
    const [archivedSorting, setArchivedSorting] = useState<SortingState>([])
    const [pointsHistorySearch, setPointsHistorySearch] = useState("")
    const [archivedPropertiesSearch, setArchivedPropertiesSearch] = useState("")
    const { user } = useAuthStore()
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

    // Fetch Points History data
    const {
        data: pointsHistoryData = [],
        isLoading: isLoadingHistory,
        refetch: refetchHistory,
    } = useQuery({
        queryKey: ["topUpHistory", statusFilter],
        queryFn: async () => {
            try {
                const response: any = await companyService.getTopUpHistoryAndPointsTransactions("deduct", 0, 999)
                return response.results || []
            } catch (error) {
                console.error("Failed to fetch top-up history:", error)
                toast.error(getErrorMessage(error))
                return []
            }
        },
        refetchOnWindowFocus: false,
    })

    // Fetch Archived Properties data
    const {
        data: archivedPropertiesData = [],
        isLoading: isLoadingArchivedProperties,
        refetch: refetchArchivedProperties,
    } = useQuery({
        queryKey: ["archivedProperties", statusFilter],
        queryFn: async () => {
            try {
                const response: any = await companyService.getTopUpHistoryAndPointsTransactions("refund", 0, 999)
                return response.results || []
            } catch (error) {
                console.error("Failed to fetch archived properties:", error)
                toast.error(getErrorMessage(error))
                return []
            }
        },
        refetchOnWindowFocus: false,
    })

    // Filter and sort Points History data
    const filteredPointsHistory = pointsHistoryData.filter((item: any) =>
        item.property?.title?.toLowerCase().includes(pointsHistorySearch.toLowerCase())
    )
    const sortedPointsHistory = filteredPointsHistory.sort((a: any, b: any) => {
        if (pointsHistorySorting.length > 0) {
            const { id, desc } = pointsHistorySorting[0]
            const aValue = a[id] ?? a.property?.[id] // Fallback to property object if column is nested
            const bValue = b[id] ?? b.property?.[id]
            if (aValue < bValue) return desc ? 1 : -1
            if (aValue > bValue) return desc ? -1 : 1
            return 0
        }
        return 0
    })

    // Filter and sort Archived Properties data
    const filteredArchivedProperties = archivedPropertiesData.filter((item: any) =>
        item.property?.title?.toLowerCase().includes(archivedPropertiesSearch.toLowerCase())
    )
    const sortedArchivedProperties = filteredArchivedProperties.sort((a: any, b: any) => {
        if (archivedSorting.length > 0) {
            const { id, desc } = archivedSorting[0]
            const aValue = a[id] ?? a.property?.[id] // Fallback to property object if column is nested
            const bValue = b[id] ?? b.property?.[id]
            if (aValue < bValue) return desc ? 1 : -1
            if (aValue > bValue) return desc ? -1 : 1
            return 0
        }
        return 0
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 top-0 z-10 pb-4 border-b">
                <h1 className="text-xl sm:text-2xl font-bold">{t("title.points")}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Available Points Card */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle>{t("title.availablePoints")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{t("text.availablePointsDescription")}</p>
                    </CardContent>
                </Card>

                {/* Points Expiry Card */}
                <Card className="flex justify-around items-center p-1">
                    <div className="flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
                        <p className="text-sm text-muted-foreground">{t("text.remainingPoints")}</p>
                        <h3 className="text-primary">{groupByThreeDigits(user?.company?.sharedPoints || 0)}</h3>
                    </div>
                    <div className="lg:col-span-1">
                        <CardHeader className="pb-2">
                            <CardTitle>{t("title.pointsExpiry")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{t("text.onDate", { date: formatDate(user?.company?.subscriptionEndDate) })}</p>
                        </CardContent>
                    </div>
                </Card>
            </div>

            {/* Points History Section */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                        <CardTitle>{t("title.pointsHistory")}</CardTitle>
                        <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search Title"
                                className="pl-8"
                                value={pointsHistorySearch}
                                onChange={(e) => setPointsHistorySearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={pointsHistoryColumns()}
                        data={sortedPointsHistory}
                        sorting={pointsHistorySorting}
                        onSortingChange={setPointsHistorySorting}
                        pageSize={10}
                    />
                </CardContent>
            </Card>

            {/* Archived Properties History Section */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                        <CardTitle>{t("title.archivedProperties")}</CardTitle>
                        <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search Title"
                                className="pl-8"
                                value={archivedPropertiesSearch}
                                onChange={(e) => setArchivedPropertiesSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={archivedPropertiesColumns()}
                        data={sortedArchivedProperties}
                        sorting={archivedSorting}
                        onSortingChange={setArchivedSorting}
                        pageSize={10}
                    />
                </CardContent>
            </Card>
        </div>
    )
}