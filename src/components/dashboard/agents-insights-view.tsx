"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "../dataTable/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { companyService } from "@/services/protected/company"
import { useQuery } from "@tanstack/react-query"
import { Loader } from "../loader"
import type { ColumnDef } from "@tanstack/react-table"

type AgentInsight = {
    id: number
    name: string
    listings: number
    lastPosted: string
    avgPostingMonthly: number
    totalLeads: number
    whatsappLeads: number
    emailLeads: number
    callLeads: number
    weeklyPerformance: number
}

export function AgentsInsightsView({ onBack }: { onBack: () => void }) {
    const [selectedAgent, setSelectedAgent] = useState("all")
    const [sorting, setSorting] = useState([])

    const { data: agentInsightsData, isLoading: isAgentInsightsLoading } = useQuery<any>({
        queryKey: ["agent-insights"],
        queryFn: () => companyService.getAgentInsights(),
    })

    // Define columns for agents table
    const agentsColumns: ColumnDef<AgentInsight>[] = [
        {
            accessorKey: "name",
            header: "Agent",
            enableSorting: true,
        },
        {
            accessorKey: "listings",
            header: "Listings",
            enableSorting: true,
        },
        {
            accessorKey: "lastPosted",
            header: "Last Posted",
            enableSorting: true,
        },
        {
            accessorKey: "avgPostingMonthly",
            header: "Avg. Posting Monthly",
            enableSorting: true,
        },
        {
            accessorKey: "totalLeads",
            header: "Total Leads",
            enableSorting: true,
        },
        {
            accessorKey: "whatsappLeads",
            header: "WhatsApp Leads",
            enableSorting: true,
        },
        {
            accessorKey: "emailLeads",
            header: "Email Leads",
            enableSorting: true,
        },
        {
            accessorKey: "callLeads",
            header: "Call Leads",
            enableSorting: true,
        },
        {
            accessorKey: "weeklyPerformance",
            header: "Weekly Performance",
            enableSorting: true,
            cell: ({ row }) => {
                const value = row.getValue("weeklyPerformance")
                const isPositive = Number(value) >= 0

                return (
                    <div className="flex items-center">
                        <span className={`${isPositive ? "text-green-500" : "text-red-500"}`}>
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
                )
            },
        },
    ]

    // Filter data based on selected agent
    const filteredData =
        agentInsightsData?.data?.filter((agent) => {
            return selectedAgent === "all" || agent.name === selectedAgent
        }) || []

    // Get unique agent names for the filter dropdown
    const uniqueAgents = agentInsightsData?.data ? [...new Set(agentInsightsData.data.map((agent) => agent.name))] : []

    return (
        <div>
            <Loader isLoading={isAgentInsightsLoading} />
            <div className="flex items-center mb-8">
                <Button variant="ghost" className="p-0 mr-2" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium">Agents Insights</h3>
            </div>

            <div className="border border-gray-100 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-semibold">Agent Details</h2>
                    <div className="w-48">
                        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                            <SelectTrigger className="w-full border-gray-200">
                                <SelectValue placeholder="Select Agent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Agents</SelectItem>
                                {uniqueAgents.map((agent) => (
                                    <SelectItem key={agent as string} value={agent as string}>
                                        {agent as string}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable
                    columns={agentsColumns}
                    data={filteredData}
                    sorting={sorting}
                    // onSortingChange={setSorting}
                    pageSize={10}
                />
            </div>
        </div>
    )
}
