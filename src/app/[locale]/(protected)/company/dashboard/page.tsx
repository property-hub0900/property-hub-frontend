"use client";

import { AgentsInsightsView } from "@/components/dashboard/agents-insights-view";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { LeadsInsightsView } from "@/components/dashboard/leads-insights-view";
import { PropertiesInsightsView } from "@/components/dashboard/properties-insights-view";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { companyService } from "@/services/protected/company";
import type { MetricsData } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define view types for better type safety
type ViewType = "dashboard" | "properties" | "agents" | "leads";
type TimeframeType = "daily" | "weekly" | "monthly" | "yearly";

// Default empty data for when no data is available
const emptyMetricsData: MetricsData = {
    isError: false,
    metrics: {
        pointsSpent: 0,
        publishedListings: 0,
        leads: 0,
        propertyViewImpressions: 0,
    },
    chartData: [],
};

// Define insight view options
const insightViews = [
    { id: "properties", label: "Properties Insights" },
    { id: "agents", label: "Agents Insights" },
    { id: "leads", label: "Leads Insights" },
];

export default function DashboardPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get view from URL or default to dashboard
    const validViews: ViewType[] = ["dashboard", "properties", "agents", "leads"];
    const viewParam = searchParams.get("view") as ViewType | null;
    const initialView = validViews.includes(viewParam as any) ? viewParam : "dashboard";
    const [activeView, setActiveView] = useState<ViewType>(initialView as ViewType);
    const [timeframe, setTimeframe] = useState<TimeframeType>("monthly");

    // Use React Query to fetch metrics data
    const { data: metricsData = emptyMetricsData as any, isLoading: isMetricsLoading } = useQuery({
        queryKey: ["metrics", timeframe],
        queryFn: () => companyService.getMetrics(timeframe),
    });

    // Prepare dashboard props with safe fallbacks
    const dashboardProps = {
        metrics: metricsData?.metrics || emptyMetricsData.metrics,
        chartData: metricsData?.chartData || [],
        hasData: Boolean(metricsData?.chartData?.length),
    };

    // Initialize activeView from URL on mount
    useEffect(() => {
        if (validViews.includes(viewParam as any) && viewParam !== activeView) {
            setActiveView(viewParam as ViewType);
        }
    }, []); // Empty dependency array ensures this runs only on mount

    // Handle view changes and update URL
    const handleViewChange = (view: ViewType) => {
        setActiveView(view);
        const params = new URLSearchParams(searchParams);
        if (view === "dashboard") {
            params.delete("view"); // Clean up URL for dashboard
            router.replace(pathname, { scroll: false });
        } else {
            params.set("view", view);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    // Handle back button
    const handleBack = () => {
        handleViewChange("dashboard");
    };

    return (
        <>
            <Loader variant="inline" isLoading={isMetricsLoading} />
            <div className="mx-auto px-4 py-6 relative">
                {activeView === "dashboard" ? (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
                            <h3 className="text-xl sm:text-2xl font-bold">Dashboard</h3>

                            {/* Desktop view buttons */}
                            <div className="hidden sm:flex gap-2">
                                {insightViews.map((view) => (
                                    <Button
                                        key={view.id}
                                        variant="outlinePrimary"
                                        onClick={() => handleViewChange(view.id as ViewType)}
                                        size="sm"
                                    >
                                        {view.label}
                                    </Button>
                                ))}
                            </div>

                            {/* Mobile dropdown */}
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
                                            <DropdownMenuItem
                                                key={view.id}
                                                onClick={() => handleViewChange(view.id as ViewType)}
                                            >
                                                {view.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Dashboard view */}
                        {!isMetricsLoading && (
                            <DashboardView
                                {...dashboardProps as any}
                                timeframe={timeframe}
                                setTimeframe={setTimeframe}
                            />
                        )}
                    </>
                ) : (
                    <>
                        {/* Insight views with back button */}
                        <div className="mb-6">
                            {activeView === "agents" && <AgentsInsightsView onBack={handleBack} />}
                            {activeView === "properties" && <PropertiesInsightsView onBack={handleBack} />}
                            {activeView === "leads" && (
                                <LeadsInsightsView
                                    onBack={handleBack}
                                    setActiveView={(view) => handleViewChange(view as ViewType)}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}