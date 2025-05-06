"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "../dataTable/data-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search } from "lucide-react";
import { companyService } from "@/services/protected/company";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../loader";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { sortTableData } from "@/utils/utils";

type AgentInsight = {
    id: number;
    name: string;
    listings: number;
    lastPosted: string;
    avgPostingMonthly: number;
    totalLeads: number;
    whatsappLeads: number;
    emailLeads: number;
    callLeads: number;
    weeklyPerformance: number;
};

export function AgentsInsightsView({ onBack }: { onBack: () => void }) {
    const t = useTranslations();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<{
        name: string; // Filter by agent name (text input)
        selectedAgent: string; // Existing filter by specific agent
    }>({
        name: "",
        selectedAgent: "all",
    });

    const { data: agentInsightsData, isLoading: isAgentInsightsLoading } = useQuery<
        any
    >({
        queryKey: ["agent-insights"],
        queryFn: () => companyService.getAgentInsights(),
    });

    // Define columns for agents table
    const agentsColumns: ColumnDef<AgentInsight>[] = [
        {
            accessorKey: "name",
            header: t("form.agent.label") || "Agent",
            enableSorting: true,
        },
        {
            accessorKey: "listings",
            header: t("form.listings.label") || "Listings",
        },
        {
            accessorKey: "lastPosted",
            header: t("form.lastPosted.label") || "Last Posted",
        },
        {
            accessorKey: "avgPostingMonthly",
            header: t("form.avgPostingMonthly.label") || "Avg. Posting Monthly",
        },
        {
            accessorKey: "totalLeads",
            header: t("form.totalLeads.label") || "Total Leads",
        },
        {
            accessorKey: "whatsappLeads",
            header: t("form.whatsappLeads.label") || "WhatsApp Leads",
        },
        {
            accessorKey: "emailLeads",
            header: t("form.emailLeads.label") || "Email Leads",
        },
        {
            accessorKey: "callLeads",
            header: t("form.callLeads.label") || "Call Leads",
        },
        {
            accessorKey: "weeklyPerformance",
            header: t("form.weeklyPerformance.label") || "Weekly Performance",
            cell: ({ row }) => {
                const value = row.original.weeklyPerformance;
                const isPositive = Number(value) >= 0;

                return (
                    <div className="flex items-center">
                        <span
                            className={`${isPositive ? "text-green-500" : "text-red-500"}`}
                        >
                            {Math.abs(Number(value) * 100).toFixed(2)}%
                        </span>
                        {isPositive ? (
                            <svg
                                className="w-4 h-4 text-green-500 ml-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 5L19 12L12 19M5 12H18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-4 h-4 text-red-500 ml-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 19L5 12L12 5M19 12H6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                );
            },
        },
    ];

    // Filter data based on selected agent and name search
    const filteredAndSortedData = useMemo(() => {
        const data = agentInsightsData?.data || [];

        // Apply filters
        const filteredItems = data.filter((agent) => {
            // Filter by selected agent
            if (
                filters.selectedAgent !== "all" &&
                agent.name !== filters.selectedAgent
            ) {
                return false;
            }

            // Filter by name search
            if (
                filters.name &&
                !agent.name.toLowerCase().includes(filters.name.toLowerCase())
            ) {
                return false;
            }

            return true;
        });

        // Apply sorting
        if (sorting.length > 0) {
            const { id, desc } = sorting[0];
            return sortTableData(filteredItems, {
                field: id as keyof AgentInsight,
                direction: desc ? "desc" : "asc",
            });
        }

        return filteredItems;
    }, [agentInsightsData, filters, sorting]);

    // Get unique agent names for the filter dropdown
    const uniqueAgents = agentInsightsData?.data
        ? [...new Set(agentInsightsData.data.map((agent: AgentInsight) => agent.name))]
        : [];

    // Handle filter changes
    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div>
            <Loader isLoading={isAgentInsightsLoading} />
            <div className="flex items-center mb-8">
                <Button variant="ghost" className="p-0 mr-2" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium">
                    {t("title.agentsInsights") || "Agents Insights"}
                </h3>
            </div>

            <div className="border border-gray-100 rounded-lg pId p-6 bg-white shadow mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-semibold">
                        {t("title.agentDetails") || "Agent Details"}
                    </h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Input
                                className="md:w-40 pl-9 pr-3 rtl:pl-3 rtl:pr-9"
                                name="name"
                                onChange={(e) => handleFilterChange("name", e.target.value)}
                                placeholder={t("form.searchAgent.label") || "Search Agent"}
                            />
                            <Search className="size-[20px] absolute right-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50" />
                        </div>
                        <div className="w-48">
                            <Select
                                value={filters.selectedAgent}
                                onValueChange={(value) =>
                                    handleFilterChange("selectedAgent", value)
                                }
                            >
                                <SelectTrigger className="w-full border-gray-200">
                                    <SelectValue
                                        placeholder={t("form.selectAgent.label") || "Select Agent"}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t("form.allAgents.label") || "All Agents"}
                                    </SelectItem>
                                    {uniqueAgents.map((agent: any) => (
                                        <SelectItem key={agent} value={agent}>
                                            {agent}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={agentsColumns}
                    data={filteredAndSortedData}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    pageSize={10}
                />
            </div>
        </div>
    );
}