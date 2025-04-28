"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { companyService } from "@/services/protected/company"
import { Loader } from "../loader"
import { DataTable } from "@/components/dataTable/data-table"
import type { ColumnDef } from "@tanstack/react-table"

type PropertyInsight = {
    refId: string
    propertyTitle: string
    propertyType: string
    agent: string
    totalLeads: number
    whatsappLeads: number
    emailLeads: number
    callLeads: number
    createdAt: string
}

export function PropertiesInsightsView({ onBack }: { onBack: () => void }) {
    const [sorting, setSorting] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedAgent, setSelectedAgent] = useState("all")

    const { data: propertyInsightsData, isLoading: isPropertyInsightsLoading } = useQuery<any>({
        queryKey: ["property-insights"],
        queryFn: () => companyService.getPropertyInsights(),
    })

    // Define columns for the DataTable
    const columns: ColumnDef<PropertyInsight>[] = [
        {
            accessorKey: "refId",
            header: "Ref. ID",
            enableSorting: true,
        },
        {
            accessorKey: "propertyTitle",
            header: "Property Title",
            enableSorting: true,
        },
        {
            accessorKey: "propertyType",
            header: "Property Type",
            enableSorting: true,
        },
        {
            accessorKey: "agent",
            header: "Agent",
            enableSorting: true,
        },
        {
            accessorKey: "totalLeads",
            header: "Total Leads",
            enableSorting: true,
            cell: ({ row }) => <div className="text-center">{row.original.totalLeads}</div>,
        },
        {
            accessorKey: "whatsappLeads",
            header: "WhatsApp Leads",
            enableSorting: true,
            cell: ({ row }) => <div className="text-center">{row.original.whatsappLeads}</div>,
        },
        {
            accessorKey: "emailLeads",
            header: "Email Leads",
            enableSorting: true,
            cell: ({ row }) => <div className="text-center">{row.original.emailLeads}</div>,
        },
        {
            accessorKey: "callLeads",
            header: "Call Leads",
            enableSorting: true,
            cell: ({ row }) => <div className="text-center">{row.original.callLeads}</div>,
        },
    ]

    // Filter data based on search query and selected agent
    const filteredData =
        propertyInsightsData?.data?.filter((property) => {
            const matchesSearch =
                searchQuery === "" || property.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesAgent = selectedAgent === "all" || property.agent === selectedAgent

            return matchesSearch && matchesAgent
        }) || []

    // Get unique agents for the filter dropdown
    const uniqueAgents = propertyInsightsData?.data
        ? [...new Set(propertyInsightsData.data.map((property) => property.agent))]
        : []

    return (
        <div>
            <Loader isLoading={isPropertyInsightsLoading} />
            <div className="flex items-center mb-8">
                <Button variant="ghost" className="p-0 mr-2" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium">Properties Insights</h3>
            </div>

            <div className="border border-gray-100 rounded-lg p-6">
                <div className="flex justify-between mb-6">
                    <h2 className="text-base font-semibold mb-6">Properties Details</h2>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Input
                                type="text"
                                placeholder="Search Title"
                                className="pl-3 pr-10 py-2 border border-gray-200 rounded-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg
                                    className="h-4 w-4 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="w-48">
                            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                                <SelectTrigger className="border-gray-200">
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
                </div>

                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        sorting={sorting}
                        // onSortingChange={setSorting}
                        pageSize={10}
                    />
                </div>

                <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="text-gray-500">
                        {filteredData.length > 0
                            ? `${filteredData.length} of ${propertyInsightsData?.total || 0} properties`
                            : "No properties found"}
                    </div>
                </div>
            </div>
        </div>
    )
}
