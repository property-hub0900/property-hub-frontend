"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, ArrowRight } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { COLOR_DASHBOARD } from "@/constants/constants"
import { useQuery } from "@tanstack/react-query"
import { companyService } from "@/services/protected/company"
import { Loader } from "../loader"

export function LeadsInsightsView({ onBack }: { onBack: () => void }) {
    const [timeframe, setTimeframe] = useState("weekly")

    const { data: leadsInsightsData, isLoading: isLeadsInsightsLoading } = useQuery<any>({
        queryKey: ["leads-insights", timeframe],
        queryFn: () => companyService.getLeadsInsights(timeframe),
    })

    // Calculate percentage for WhatsApp leads circle
    const whatsappPercentage = leadsInsightsData?.totalLeads
        ? (leadsInsightsData.leadsByType.whatsapp / leadsInsightsData.totalLeads) * 100
        : 0

    // Calculate the stroke-dashoffset for the circle
    const circleDashoffset = 251.2 - (251.2 * whatsappPercentage) / 100

    // Get the highest value in the WhatsApp chart data for better visualization
    const maxWhatsappValue = leadsInsightsData?.whatsappData?.chartData
        ? Math.max(...leadsInsightsData.whatsappData.chartData.map((item: any) => item.value))
        : 0

    // Find the day with the highest value for the annotation
    const highestDay = leadsInsightsData?.whatsappData?.chartData
        ? leadsInsightsData.whatsappData.chartData.reduce((max: any, item: any) => (item.value > max.value ? item : max), {
            value: 0,
            day: "",
        })
        : { day: "", value: 0 }

    return (
        <div>
            <Loader isLoading={isLeadsInsightsLoading} />
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
                                <h4>{leadsInsightsData?.leadsByType?.whatsapp || 0}</h4>
                            </div>
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke={COLOR_DASHBOARD}
                                    strokeWidth="12"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={circleDashoffset}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <Button variant="link" className="text-primary text-sm p-0">
                            View Per Agent <ArrowRight className="h-3 w-3 ml-1 inline" />
                        </Button>
                    </div>
                </div>

                {/* WhatsApp Leads Chart */}
                <div className="border border-gray-100 rounded-lg p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-medium">WhatsApp Leads</h2>
                        <div className="relative inline-block">
                            <button
                                className="flex items-center text-xs border border-gray-200 rounded px-2 py-1"
                                onClick={() => {
                                    const newTimeframe = timeframe === "weekly" ? "monthly" : "weekly"
                                    setTimeframe(newTimeframe)
                                }}
                            >
                                {timeframe === "weekly" ? "Weekly" : "Monthly"}
                                <ChevronDown className="h-3 w-3 ml-1" />
                            </button>
                        </div>
                    </div>

                    {leadsInsightsData?.whatsappData?.chartData && (
                        <>
                            <div className="grid grid-cols-6 text-xs text-gray-500 mb-1">
                                {leadsInsightsData.whatsappData.chartData.map((item: any) => (
                                    <div key={item.day + item.date} className="text-center">
                                        {item.day}
                                        <div>{item.date}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-[180px] relative">
                                {highestDay.value > 0 && (
                                    <div className="absolute right-0 top-0 text-xs text-gray-500">
                                        {highestDay.value} New Lead{highestDay.value > 1 ? "s" : ""} on {highestDay.day}
                                    </div>
                                )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={leadsInsightsData.whatsappData.chartData}
                                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorWhatsapp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="10%" stopColor="rgba(74, 160, 217, 1)" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="white" stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="day" hide />
                                        <YAxis hide domain={[0, "auto"]} />

                                        {/* Top line with no fill */}
                                        <Area
                                            type="monotone"
                                            dataKey="topLine"
                                            stroke={COLOR_DASHBOARD}
                                            strokeWidth={2}
                                            fillOpacity={0}
                                            fill="transparent"
                                        />

                                        {/* Bottom area with gradient fill */}
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={COLOR_DASHBOARD}
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorWhatsapp)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}

                    <div className="text-center text-xs text-gray-500 mt-2">Total WhatsApp leads per day</div>
                </div>

                {/* Call Data Section */}
                <div className="border border-gray-100 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-base font-medium">Call Data</h2>
                        <div className="text-xs text-gray-500">{new Date().toLocaleDateString()}</div>
                    </div>

                    <div className="mt-6">
                        <div className="text-xs text-gray-500">Total Calls</div>
                        <div className="text-4xl font-bold text-primary">{leadsInsightsData?.callData?.totalCalls || 0}</div>
                    </div>

                    <div className="mt-6">
                        <div className="text-xs text-gray-500">Today's Calls</div>
                        <div className="text-4xl font-bold text-primary">{leadsInsightsData?.callData?.todaysCalls || 0}</div>
                    </div>

                    <div className="mt-6 text-center">
                        <Button variant="link" className="text-primary text-sm p-0">
                            View Per Agent <ArrowRight className="h-3 w-3 ml-1 inline" />
                        </Button>
                    </div>
                </div>

                {/* Calls per hour Chart */}
                <div className="border border-gray-100 rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-base font-medium mb-4">Calls per hour</h2>

                    {leadsInsightsData?.callsPerHourData && (
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leadsInsightsData.callsPerHourData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                    <CartesianGrid vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={[0, "auto"]} />
                                    <Bar dataKey="calls" fill={COLOR_DASHBOARD} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="text-center text-xs text-gray-500 mt-2">Calls per hour</div>
                </div>
            </div>
        </div>
    )
}
