"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, ArrowRight, ArrowLeftIcon } from "lucide-react"

export function PropertiesInsightsView({ onBack }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState("asc")

    // Sample data for properties table
    const propertiesData = [
        {
            refId: "1234",
            propertyTitle: "Fully Furnished Villa",
            agent: "Abdul Ali",
            totalLeads: 20,
            whatsappLeads: 9,
            emailLeads: 10,
            callLeads: 20,
        },
        {
            refId: "1234",
            propertyTitle: "Fully Furnished Villa",
            agent: "Ahmad Ali",
            totalLeads: 8,
            whatsappLeads: 4,
            emailLeads: 12,
            callLeads: 8,
        },
        {
            refId: "1234",
            propertyTitle: "Fully Furnished Villa",
            agent: "M. Hazem",
            totalLeads: 18,
            whatsappLeads: 2,
            emailLeads: 6,
            callLeads: 18,
        },
    ]

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    const SortIcon = ({ column }) => {
        if (sortColumn !== column) {
            return null
        }
        return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
    }

    return (
        <div>
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
                            <Select>
                                <SelectTrigger className="border-gray-200">
                                    <SelectValue placeholder="Select Agent" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Agents</SelectItem>
                                    <SelectItem value="abdul">Abdul Ali</SelectItem>
                                    <SelectItem value="ahmad">Ahmad Ali</SelectItem>
                                    <SelectItem value="hazem">M. Hazem</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("refId")}>
                                    <div className="flex items-center">
                                        Ref. ID
                                        <SortIcon column="refId" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort("propertyTitle")}>
                                    <div className="flex items-center">
                                        Property Title
                                        <SortIcon column="propertyTitle" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort("agent")}>
                                    <div className="flex items-center">
                                        Agent
                                        <SortIcon column="agent" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("totalLeads")}>
                                    <div className="flex items-center justify-end">
                                        Total Leads
                                        <SortIcon column="totalLeads" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("whatsappLeads")}>
                                    <div className="flex items-center justify-end">
                                        WhatsApp Leads
                                        <SortIcon column="whatsappLeads" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("emailLeads")}>
                                    <div className="flex items-center justify-end">
                                        Email Leads
                                        <SortIcon column="emailLeads" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("callLeads")}>
                                    <div className="flex items-center justify-end">
                                        Call Leads
                                        <SortIcon column="callLeads" />
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {propertiesData.map((property, index) => (
                                <TableRow key={index}>
                                    <TableCell>{property.refId}</TableCell>
                                    <TableCell>{property.propertyTitle}</TableCell>
                                    <TableCell>{property.agent}</TableCell>
                                    <TableCell className="text-right">{property.totalLeads}</TableCell>
                                    <TableCell className="text-right">{property.whatsappLeads}</TableCell>
                                    <TableCell className="text-right">{property.emailLeads}</TableCell>
                                    <TableCell className="text-right">{property.callLeads}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="text-gray-500">5 of 5 row(s) selected</div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            <span className="flex items-center">
                                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                                Previous
                            </span>
                        </Button>

                        <Button
                            variant={currentPage === 1 ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage(1)}
                        >
                            1
                        </Button>

                        <Button
                            variant={currentPage === 2 ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage(2)}
                        >
                            2
                        </Button>

                        <Button
                            variant={currentPage === 3 ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setCurrentPage(3)}
                        >
                            3
                        </Button>

                        <span className="mx-1">...</span>

                        <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setCurrentPage(currentPage + 1)}>
                            <span className="flex items-center">
                                Next
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
