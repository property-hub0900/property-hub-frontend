"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, ArrowRight } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

export function LeadsInsightsView({ onBack }) {
    const [timeframe, setTimeframe] = useState("weekly")

    // Sample data for WhatsApp leads chart
    const whatsappData = [
        { day: "Mon", value: 30, date: "10" },
        { day: "Tue", value: 40, date: "11" },
        { day: "Wed", value: 35, date: "12" },
        { day: "Thu", value: 50, date: "13" },
        { day: "Fri", value: 45, date: "14" },
        { day: "Sat", value: 60, date: "15" },
    ]

    // Sample data for calls per hour chart
    const callsData = Array.from({ length: 24 }, (_, i) => ({
        hour: i + 1,
        calls: Math.floor(Math.random() * 80) + 20,
    }))

    return (
        <div>
            <div className="flex items-center mb-8">
                <Button variant="ghost" className="p-0 mr-2" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium">Leads Insights</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* WhatsApp Data Section */}
                <div className="border border-gray-100 rounded-lg p-6">
                    <h2 className="text-base font-medium mb-6">WhatsApp Data</h2>

                    <div className="flex justify-center">
                        <div className="relative w-40 h-40">
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <div className="text-xs text-gray-500">Total Leads</div>
                                <div className="text-4xl font-bold mt-1">350</div>
                            </div>
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="12"
                                    strokeDasharray="251.2"
                                    strokeDashoffset="62.8"
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <Button variant="link" className="text-blue-500 text-sm p-0">
                            View Per Agent <ArrowRight className="h-3 w-3 ml-1 inline" />
                        </Button>
                    </div>
                </div>

                {/* WhatsApp Leads Chart */}
                <div className="border border-gray-100 rounded-lg p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-medium">WhatsApp Leads</h2>
                        <div className="relative inline-block">
                            <button className="flex items-center text-xs border border-gray-200 rounded px-2 py-1">
                                Weekly
                                <ChevronDown className="h-3 w-3 ml-1" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 text-xs text-gray-500 mb-1">
                        {whatsappData.map((item) => (
                            <div key={item.day} className="text-center">
                                {item.day}
                                <div>{item.date}</div>
                            </div>
                        ))}
                    </div>

                    <div className="h-[180px] relative">
                        <div className="absolute right-0 top-0 text-xs text-gray-500">10 New Leads on Friday</div>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={whatsappData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWhatsapp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="day" hide />
                                <YAxis hide domain={[0, 100]} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorWhatsapp)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="text-center text-xs text-gray-500 mt-2">Total WhatsApp leads per day</div>
                </div>

                {/* Call Data Section */}
                <div className="border border-gray-100 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-base font-medium">Call Data</h2>
                        <div className="text-xs text-gray-500">25 Mar, 2023</div>
                    </div>

                    <div className="mt-6">
                        <div className="text-xs text-gray-500">Total Calls</div>
                        <div className="text-4xl font-bold text-blue-500">350</div>
                    </div>

                    <div className="mt-6">
                        <div className="text-xs text-gray-500">Today's Calls</div>
                        <div className="text-4xl font-bold text-blue-500">10</div>
                    </div>

                    <div className="mt-6 text-center">
                        <Button variant="link" className="text-blue-500 text-sm p-0">
                            View Per Agent <ArrowRight className="h-3 w-3 ml-1 inline" />
                        </Button>
                    </div>
                </div>

                {/* Calls per hour Chart */}
                <div className="border border-gray-100 rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-base font-medium mb-4">Calls per hour</h2>

                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={callsData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10 }}
                                    domain={[0, 100]}
                                    ticks={[0, 20, 40, 60, 80, 100]}
                                />
                                <Bar dataKey="calls" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="text-center text-xs text-gray-500 mt-2">Calls per hour</div>
                </div>
            </div>
        </div>
    )
}
