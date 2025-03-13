"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash } from "lucide-react"
import { useState } from "react"

interface Agent {
    id: string
    fullName: string
    type: "Agent" | "Admin"
    joinedDate: string
    status: "Active" | "In-active"
}

export default function AccessManagementPage() {
    const [agents, setAgents] = useState<Agent[]>([
        {
            id: "1",
            fullName: "Ahmad Akbar",
            type: "Agent",
            joinedDate: "12-Feb-25",
            status: "Active",
        },
        {
            id: "2",
            fullName: "Mohammad Ali",
            type: "Admin",
            joinedDate: "14-Feb-25",
            status: "Active",
        },
        {
            id: "3",
            fullName: "Ali Rehman",
            type: "Agent",
            joinedDate: "20-Feb-25",
            status: "In-active",
        },
    ])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Company Agents</h2>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    + Add New Agent
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-medium">Full Name</TableHead>
                            <TableHead className="font-medium">Type</TableHead>
                            <TableHead className="font-medium">Joined Date</TableHead>
                            <TableHead className="font-medium">Status</TableHead>
                            <TableHead className="font-medium">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {agents.map((agent) => (
                            <TableRow key={agent.id}>
                                <TableCell>{agent.fullName}</TableCell>
                                <TableCell>{agent.type}</TableCell>
                                <TableCell>{agent.joinedDate}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <span
                                            className={`h-2 w-2 rounded-full mr-2 ${agent.status === "Active" ? "bg-green-500" : "bg-gray-400"
                                                }`}
                                        />
                                        {agent.status}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-3 items-center">
                                        <Button variant="ghost" size="icon" className="text-blue-500 h-8 w-8">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

