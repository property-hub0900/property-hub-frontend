"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "../dataTable/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

export function AgentsInsightsView({ onBack }) {
    // Sample data for agents table
    const agentsData = [
        {
            id: 1,
            name: "Hazem",
            listings: 101,
            lastPosted: "5 Days",
            avgPostingMonthly: 5,
            totalLeads: 20,
            whatsappLeads: 6,
            emailLeads: 10,
            callLeads: 20,
            weeklyPerformance: -0.48,
        },
        {
            id: 2,
            name: "Ali Imran",
            listings: 120,
            lastPosted: "10 Days",
            avgPostingMonthly: 3,
            totalLeads: 8,
            whatsappLeads: 4,
            emailLeads: 12,
            callLeads: 8,
            weeklyPerformance: 0.45,
        },
        {
            id: 3,
            name: "Ahmad Ali",
            listings: 90,
            lastPosted: "2 Days",
            avgPostingMonthly: 11,
            totalLeads: 18,
            whatsappLeads: 2,
            emailLeads: 6,
            callLeads: 18,
            weeklyPerformance: -0.48,
        },
    ]

    // Define columns for agents table
    const agentsColumns = [
        {
            accessorKey: "name",
            header: "Agent",
        },
        {
            accessorKey: "listings",
            header: "Listings",
        },
        {
            accessorKey: "lastPosted",
            header: "Last Posted",
        },
        {
            accessorKey: "avgPostingMonthly",
            header: "Avg. Posting Monthly",
        },
        {
            accessorKey: "totalLeads",
            header: "Total Leads",
        },
        {
            accessorKey: "whatsappLeads",
            header: "WhatsApp Leads",
        },
        {
            accessorKey: "emailLeads",
            header: "Email Leads",
        },
        {
            accessorKey: "callLeads",
            header: "Call Leads",
        },
        {
            accessorKey: "weeklyPerformance",
            header: "Weekly Performance",
            cell: ({ row }) => {
                const value = row.getValue("weeklyPerformance")
                const isPositive = value >= 0

                return (
                    <div className="flex items-center">
                        <span className={`${isPositive ? "text-green-500" : "text-red-500"}`}>
                            {Math.abs(value * 100).toFixed(2)}%
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

    return (
        <div>
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
                        <Select>
                            <SelectTrigger className="w-full border-gray-200">
                                <SelectValue placeholder="Select Agent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Agents</SelectItem>
                                <SelectItem value="hazem">Hazem</SelectItem>
                                <SelectItem value="ali">Ali Imran</SelectItem>
                                <SelectItem value="ahmad">Ahmad Ali</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable columns={agentsColumns} data={agentsData} />
            </div>
        </div>
    )
}
