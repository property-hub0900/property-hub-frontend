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

// Mock data for points history
const pointsHistoryData = [
    { id: "123", title: "High Floor", actionType: "Ad Posting", pointsReceived: 10, date: "Mar 1, 2023" },
    {
        id: "456",
        title: "Villa with Sea View",
        actionType: "Featured Property",
        pointsReceived: 100,
        date: "Mar 2, 2023",
    },
    { id: "789", title: "Wakrah", actionType: "Ad Posting", pointsReceived: 30, date: "Mar 4, 2023" },
]

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

                <Card className="flex justify-around">
                    <div className="flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
                        <p className="text-sm text-muted-foreground">Remaining Points</p>
                        <div className="text-4xl sm:text-5xl font-bold text-primary">500</div>
                    </div>
                    <div className="lg:col-span-1">
                        <CardHeader className="pb-2">
                            <CardTitle>Points Expiry</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">on April 30, 2025</p>
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
                        columns={archivedPropertiesColumns as any}
                        data={archivedPropertiesData}
                        sorting={archivedSorting}
                        onSortingChange={setArchivedSorting}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
