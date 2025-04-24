"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown } from 'lucide-react'

import { AgentsInsightsView } from "@/components/dashboard/agents-insights-view"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { LeadsInsightsView } from "@/components/dashboard/leads-insights-view"
import { PropertiesInsightsView } from "@/components/dashboard/properties-insights-view"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { companyService } from "@/services/protected/company"
import { Loader } from "@/components/loader"
import { MetricsData } from "@/types/common"

// Define types for our metrics data




// Default empty data for when no data is available
const emptyMetricsData: MetricsData = {
    isError: false,
    metrics: {
        pointsSpent: 0,
        publishedListings: 0,
        leads: 0,
        propertyViewImpressions: 0
    },
    chartData: []
}

export default function DashboardPage() {
    const [activeView, setActiveView] = useState("dashboard")

    const insightViews = [
        { id: "properties", label: "Properties Insights" },
        { id: "agents", label: "Agents Insights" },
        { id: "leads", label: "Leads Insights" },
    ]

    // Use React Query to fetch metrics data
    const { data: metricsData, isLoading } = useQuery<MetricsData | any>({
        queryKey: ["metrics"],
        queryFn: () => companyService.getMetrics(),
        placeholderData: emptyMetricsData,
    })

    const dashboardProps = {
        metrics: metricsData?.metrics || emptyMetricsData.metrics,
        chartData: metricsData?.chartData || emptyMetricsData.chartData,
        hasData: Boolean(metricsData?.chartData?.length)
    }

    return (
        <div className="mx-auto px-4 py-6">
            {activeView === "dashboard" && (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
                        <h3 className="text-xl sm:text-2xl font-bold">Dashboard</h3>

                        <div className="hidden sm:flex gap-2">
                            {insightViews.map((view) => (
                                <Button
                                    key={view.id}
                                    variant="outlinePrimary"
                                    onClick={() => setActiveView(view.id)}
                                    size="sm"
                                >
                                    {view.label}
                                </Button>
                            ))}
                        </div>

                        <div className="sm:hidden w-full">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between border-primary">
                                        Insights
                                        <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    {insightViews.map((view) => (
                                        <DropdownMenuItem key={view.id} onClick={() => setActiveView(view.id)}>
                                            {view.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Loader isLoading={isLoading} />

                    {/* Only render dashboard when not loading */}
                    {!isLoading && <DashboardView {...dashboardProps as any} />}
                </>
            )}

            {activeView === "agents" && <AgentsInsightsView onBack={() => setActiveView("dashboard")} />}
            {activeView === "properties" && <PropertiesInsightsView onBack={() => setActiveView("dashboard")} />}
            {activeView === "leads" && <LeadsInsightsView onBack={() => setActiveView("dashboard")} />}
        </div>
    )
}