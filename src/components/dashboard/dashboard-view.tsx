"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Wallet, FileText, Users, CheckCircle, ChevronDown } from "lucide-react"
import { MetricCard } from "./metric-card"

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

    const CustomizedDot = (props) => {
        // Remove dots completely
        return null
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md text-xs">
                    <p className="font-medium">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <MetricCard value="760" label="Points Spent" icon={<Wallet className="h-5 w-5 text-blue-400" />} />
                <MetricCard value="900" label="Published Listings" icon={<FileText className="h-5 w-5 text-blue-400" />} />
                <MetricCard value="13000" label="Leads" icon={<Users className="h-5 w-5 text-blue-400" />} />
                <MetricCard
                    value="20,004"
                    label="Property View Impressions"
                    icon={<CheckCircle className="h-5 w-5 text-blue-400" />}
                />
            </div>

            {/* Chart Section */}
            <div className="border border-gray-100 rounded-lg p-6 mb-6">
                {/* Chart Header - Exact match to the image */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-semibold">Total Leads</h2>

                    <div className="flex items-center">
                        {/* Legend dots with proper spacing */}
                        <div className="flex items-center mr-6">
                            <div className="flex items-center mr-4">
                                <div className="w-2 h-2 rounded-full bg-[#4ade80] mr-1.5"></div>
                                <span className="text-xs">WhatsApp</span>
                            </div>
                            <div className="flex items-center mr-4">
                                <div className="w-2 h-2 rounded-full bg-[#3b82f6] mr-1.5"></div>
                                <span className="text-xs">Email</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-[#f97316] mr-1.5"></div>
                                <span className="text-xs">Call</span>
                            </div>
                        </div>

                        {/* Custom Monthly dropdown to match the image exactly */}
                        <div className="relative inline-block">
                            <button className="flex items-center text-xs px-1">
                                Monthly
                                <ChevronDown className="h-3 w-3 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute right-0 top-0 text-xs text-gray-500 mr-6">10 Leads</div>
                    <div className="h-[240px] mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#888" }}
                                    domain={[0, 100]}
                                    ticks={[0, 20, 40, 60, 80, 100]}
                                />
                                <Tooltip content={<CustomTooltip
                                    active={true}
                                    payload={[]}
                                    label={""}
                                />} />
                                <ReferenceLine x="May" stroke="#e0f2fe" strokeWidth={20} ifOverflow="extendDomain" />
                                <Line
                                    type="monotone"
                                    dataKey="whatsapp"
                                    stroke="#4ade80"
                                    strokeWidth={2}
                                    dot={<CustomizedDot />}
                                    activeDot={{ r: 6, fill: "#4ade80" }}
                                    name="WhatsApp"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="email"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={<CustomizedDot />}
                                    activeDot={{ r: 6, fill: "#3b82f6" }}
                                    name="Email"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="call"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    dot={<CustomizedDot />}
                                    activeDot={{ r: 6, fill: "#f97316" }}
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
