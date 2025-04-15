"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Wallet, FileText, Users, CheckCircle, ChevronDown } from "lucide-react"
import { MetricCard } from "./metric-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DashboardView() {
    const [timeframe, setTimeframe] = useState("monthly")

    // Sample data for the chart
    const data = [
        { name: "Jan", whatsapp: 25, email: 20, call: 5 },
        { name: "Feb", whatsapp: 30, email: 35, call: 15 },
        { name: "Mar", whatsapp: 35, email: 25, call: 5 },
        { name: "Apr", whatsapp: 50, email: 40, call: 25 },
        { name: "May", whatsapp: 65, email: 60, call: 35 },
        { name: "Jun", whatsapp: 60, email: 45, call: 40 },
        { name: "Jul", whatsapp: 70, email: 40, call: 30 },
        { name: "Aug", whatsapp: 65, email: 45, call: 25 },
        { name: "Sep", whatsapp: 60, email: 50, call: 30 },
        { name: "Oct", whatsapp: 55, email: 45, call: 35 },
        { name: "Nov", whatsapp: 60, email: 55, call: 45 },
        { name: "Dec", whatsapp: 70, email: 60, call: 50 },
    ]

    const timeframeOptions = ["daily", "weekly", "monthly", "yearly"]

    const CustomizedDot = () => {
        // Remove dots completely
        return null
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md text-xs max-w-[200px] z-50">
                    <p className="font-medium mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} className="flex items-center gap-1.5 mb-0.5" style={{ color: entry.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                            <span>
                                {entry.name}: {entry.value}
                            </span>
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-10">
                <MetricCard value="760" label="Points Spent" icon={<Wallet className="h-5 w-5 text-primary" />} />
                <MetricCard value="900" label="Published Listings" icon={<FileText className="h-5 w-5 text-primary" />} />
                <MetricCard value="13000" label="Leads" icon={<Users className="h-5 w-5 text-primary" />} />
                <MetricCard
                    value="20,004"
                    label="Property View Impressions"
                    icon={<CheckCircle className="h-5 w-5 text-primary" />}
                />
            </div>

            {/* Chart Section */}
            <div className="border border-gray-100 rounded-lg p-3 sm:p-4 md:p-6 mb-6">
                {/* Chart Header - Responsive layout */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 md:mb-6">
                    <h4>Total Leads</h4>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 w-full sm:w-auto">
                        {/* Legend dots with responsive layout */}
                        <div className="flex flex-wrap gap-y-2 gap-x-4 mr-0 sm:mr-6 w-full sm:w-auto">
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-[#4ade80] mr-1.5"></div>
                                <span className="text-xs">WhatsApp</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-primary mr-1.5"></div>
                                <span className="text-xs">Email</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-[#f97316] mr-1.5"></div>
                                <span className="text-xs">Call</span>
                            </div>
                        </div>

                        {/* Timeframe dropdown with shadcn/ui components */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-normal">
                                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                                    <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[100px]">
                                {timeframeOptions.map((option) => (
                                    <DropdownMenuItem key={option} className="text-xs capitalize" onClick={() => setTimeframe(option)}>
                                        {option}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="relative">
                    {/* <div className="absolute right-0 top-0 text-xs text-gray-500 mr-2 sm:mr-6">10 Leads</div>r */}
                    <div className="h-[200px] sm:h-[240px] mt-6 -ml-2 sm:ml-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 5,
                                    left: -20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#888" }}
                                    dy={10}
                                    interval="preserveStartEnd"
                                    minTickGap={5}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#888" }}
                                    domain={[0, 100]}
                                    ticks={[0, 20, 40, 60, 80, 100]}
                                    width={30}
                                />
                                <Tooltip content={<CustomTooltip
                                    active={true}
                                    payload={[]}
                                    label={""}
                                />} wrapperStyle={{ zIndex: 10 }} />
                                <ReferenceLine x="May" stroke="#e0f2fe" strokeWidth={20} ifOverflow="extendDomain" />
                                <Line
                                    type="monotone"
                                    dataKey="whatsapp"
                                    stroke="#4ade80"
                                    strokeWidth={2}
                                    dot={<CustomizedDot />}
                                    activeDot={{ r: 5, fill: "#4ade80" }}
                                    name="WhatsApp"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="email"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={<CustomizedDot />}
                                    activeDot={{ r: 5, fill: "#3b82f6" }}
                                    name="Email"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="call"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    dot={<CustomizedDot />}
                                    activeDot={{ r: 5, fill: "#f97316" }}
                                    name="Call"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    )
}
