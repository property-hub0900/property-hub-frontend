"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PERMISSIONS } from "@/constants/rbac"
import { useRBAC } from "@/lib/hooks/useRBAC"
import { AlertCircle, CheckCircle, ChevronDown, FileText, Users, Wallet } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { MetricCard } from "./metric-card"
import { useTranslations } from "next-intl"

interface LeadChannel {
    name: string
    whatsapp: number
    email: number
    call: number
    visit: number
}

interface DashboardViewProps {
    metrics: {
        pointsSpent: number
        publishedListings: number
        leads: number
        propertyViewImpressions: number
    }
    chartData: LeadChannel[]
    hasData: boolean
    timeframe: string
    setTimeframe: (timeframe: string) => void
}

interface CustomTooltipProps {
    active?: boolean
    payload?: any[]
    label?: string
}

export function DashboardView({ metrics, chartData, hasData, timeframe, setTimeframe }: Readonly<DashboardViewProps>) {
    const t = useTranslations()
    const timeframeOptions = [(t("form.selectTimeframe.options.monthly")), t("form.selectTimeframe.options.yearly")]

    const { hasPermission } = useRBAC();

    const CustomizedDot = () => {
        // Remove dots completely
        return null
    }

    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload?.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md text-xs max-w-[200px] z-50">
                    <p className="font-medium mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index * Math.random()}`} className="flex items-center gap-1.5 mb-0.5" style={{ color: entry.color }}>
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

    // Format numbers with commas
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    const showPointsSpent = hasPermission(PERMISSIONS.POINT_SUBSCRIPTION_TOPUP_GLOBAL_PRIVACY_FOR_DASHBOARD)
    return (
        <>
            {/* Key Metrics */}
            {/* make sure if three item then handle gracefully */}
            <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${showPointsSpent ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 md:gap-6 mb-6 md:mb-10`}
            >
                {showPointsSpent && (
                    <MetricCard
                        value={formatNumber(metrics.pointsSpent)}
                        label={t("title.pointsSpent")}
                        icon={<Wallet className="h-5 w-5 text-primary" />}
                    />
                )}
                <MetricCard
                    value={formatNumber(metrics.publishedListings)}
                    label={t("title.publishedListings")}
                    icon={<FileText className="h-5 w-5 text-primary" />}
                />
                <MetricCard value={formatNumber(metrics.leads)} label={t("title.leads")} icon={<Users className="h-5 w-5 text-primary" />} />
                <MetricCard
                    value={formatNumber(metrics.propertyViewImpressions)}
                    label={t("title.propertyViews")}
                    icon={<CheckCircle className="h-5 w-5 text-primary" />}
                />
            </div>


            {/* Chart Section */}
            <div className=" rounded-lg p-3 sm:p-4 md:p-6 mb-6">
                {/* Chart Header - Responsive layout */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 md:mb-6">
                    <h4>{t("title.totalLeads")}</h4>

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
                                    <DropdownMenuItem key={option} className="text-xs capitalize" onClick={() => setTimeframe(`${option}`.toLowerCase())}>
                                        {option}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="relative">
                    {hasData ? (
                        <div className="h-[400px] sm:h-[240px] mt-6 ml-2 sm:ml-0">
                            {/*  80 percent of remaing screen height */}
                            <ResponsiveContainer width="100%" height="150%">
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        left: 20,
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
                                        width={30}
                                        domain={[0, 'dataMax + 1']}  // Set domain from 0 to max value + 1
                                        allowDecimals={false}        // No decimal ticks
                                        tickMargin={20}
                                    />
                                    <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 10 }} />
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
                    ) : (
                        <div className="h-[200px] flex flex-col items-center justify-center text-gray-500">
                            <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
                            <p className="text-sm">No lead data available for this period</p>
                            <p className="text-xs mt-1">Try changing the time period or check back later</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}