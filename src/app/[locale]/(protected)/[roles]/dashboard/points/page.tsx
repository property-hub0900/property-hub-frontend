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
import { formatDate, getErrorMessage } from "@/utils/utils"
import { useQuery } from "@tanstack/react-query"
import { companyService } from "@/services/protected/company"
import { toast } from "sonner"



// Mock data for archived properties
const archivedPropertiesData = [
    {
        id: "123",
        title: "Furnished Villa",
        pointsRefundable: 10,
        archivedDate: "Mar 10, 2023",
        afterPublish: "10 Days",
        status: "active",
    },
    {
        id: "456",
        title: "High Floor",
        pointsRefundable: 7,
        archivedDate: "Mar 12, 2023",
        afterPublish: "15 Days",
        status: "refunded",
    },
    {
        id: "789",
        title: "High Floor",
        pointsRefundable: 2,
        archivedDate: "Mar 14, 2023",
        afterPublish: "10 Days",
        status: "refunded",
    },
]

export default function PointsPage() {
    // const t = useTranslations()
    const [pointsHistorySorting, setPointsHistorySorting] = useState<SortingState>([])
    const [archivedSorting, setArchivedSorting] = useState<SortingState>([])
    const { user } = useAuthStore()
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)



    const {
        data: pointsHistoryData = [],
        isLoading: isLoadingHistory,
        refetch: refetchHistory,
    } = useQuery({
        queryKey: ["topUpHistory", statusFilter], // Include statusFilter in the query key
        queryFn: async () => {
            try {
                const response: any = await companyService.getTopUpHistoryAndPointsTransactions("topup", 0, 999)
                return response.results || []
            } catch (error) {
                console.error("Failed to fetch top-up history:", error)
                toast.error(getErrorMessage(error))
                return []
            }
        },
        // Enable refetching when component mounts or when dependencies change
        refetchOnWindowFocus: false,
    })


    const {
        data: archivedPropertiesData = [],
        isLoading: isLoadingArchivedProperties,
        refetch: refetchArchivedProperties,
    } = useQuery({
        queryKey: ["archivedProperties", statusFilter], // Include statusFilter in the query key
        queryFn: async () => {
            try {
                const response: any = await companyService.getTopUpHistoryAndPointsTransactions("refund", 0, 999)
                return response.results || []
            } catch (error) {
                console.error("Failed to fetch top-up history:", error)
                toast.error(getErrorMessage(error))
                return []
            }
        },
        // Enable refetching when component mounts or when dependencies change
        refetchOnWindowFocus: false,
    })


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 top-0 z-10 pb-4 border-b">
                <h1 className="text-xl sm:text-2xl font-bold">Points</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Available Points Card */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle>Available Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Users earn points based on their subscription plan.</p>

                    </CardContent>
                </Card>

                {/* Points Expiry Card */}

                <Card className="flex justify-around items-center p-1">
                    <div className="flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
                        <p className="text-sm text-muted-foreground">Remaining Points</p>
                        <h3 className="text-primary">{user?.company?.sharedPoints}</h3>
                    </div>
                    <div className="lg:col-span-1">
                        <CardHeader className="pb-2">
                            <CardTitle>Points Expiry</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">on {formatDate(user?.company?.subscriptionEndDate)}</p>
                        </CardContent>

                    </div>
                </Card>
            </div>

            {/* Points History Section */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                        <CardTitle>Points History</CardTitle>
                        <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search Title" className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={pointsHistoryColumns}
                        data={pointsHistoryData}
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
                        <CardTitle>Archived Properties History</CardTitle>
                        <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search Title" className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={archivedPropertiesColumns}
                        data={archivedPropertiesData}
                        sorting={archivedSorting}
                        onSortingChange={setArchivedSorting}
                        pageSize={10}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
