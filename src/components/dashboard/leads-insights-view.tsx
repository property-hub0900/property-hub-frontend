"use client"

import { Button } from "@/components/ui/button"
import { COLOR_DASHBOARD } from "@/constants/constants"
import { companyService } from "@/services/protected/company"
import { groupByThreeDigits } from "@/utils/utils"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Loader } from "../loader"
import { DatePickerLight } from "../ui/date-picker-light"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import moment from "moment"
import { useTranslations } from "next-intl"

const CustomTooltip = ({ active, payload, label }: any) => {
    const t = useTranslations()
    if (active && payload?.length) {
        const valuePayload = payload.find((entry: any) => entry.dataKey === "value")
        if (valuePayload) {
            return (
                <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-md text-xs">
                    <p className="font-medium mb-2">{label}</p>
                    <div className="flex items-center text-gray-700">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: valuePayload.color }}></div>
                        <span>
                            {valuePayload.value} {valuePayload.value > 1 ? t("text.newLeads") : t("text.newLead")} {t("text.onDate", { date: valuePayload.payload.day })}
                        </span>
                    </div>
                </div>
            )
        }
    }
    return null
}

export function LeadsInsightsView({
    onBack,
    setActiveView,
}: { onBack: () => void; setActiveView: (view: string) => void }) {
    const t = useTranslations()
    const [timeframe, setTimeframe] = useState("monthly")
    const [date, setDate] = useState(new Date().toISOString())

    const { data: leadsInsightsData, isLoading: isLeadsInsightsLoading } = useQuery<any>({
        queryKey: ["leads-insights", timeframe],
        queryFn: () => companyService.getLeadsInsights(timeframe),
    })

    const { data: callsData } = useQuery<any>({
        queryKey: ["calls-data", date],
        queryFn: () => companyService.getCallsData(moment(date).format("YYYY-MM-DD")),
    })

    console.log({ callsData })

    const whatsappPercentage = leadsInsightsData?.totalLeads
        ? (leadsInsightsData.leadsByType.whatsapp / leadsInsightsData.totalLeads) * 100
        : 0

    const circleDashoffset = 251.2 - (251.2 * whatsappPercentage) / 100

    return (
        <div>
            <Loader isLoading={isLeadsInsightsLoading} />
            <div className="flex items-center mb-8">
                <Button variant="ghost" className="p-0 mr-2" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium">{t("title.leadsInsights")}</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* WhatsApp Data Section */}
                <div className="border border-gray-100 rounded-lg p-6">
                    <h2 className="text-base font-medium mb-6">{t("title.whatsappData")}</h2>
                    <div className="flex justify-center">
                        <div className="relative w-40 h-40">
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <div className="text-xs text-gray-500">{t("text.totalLead")}</div>
                                <h4>{groupByThreeDigits(leadsInsightsData?.leadsByType?.whatsapp || 0)}</h4>
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
                        <Button variant="link" className="text-primary text-sm p-0" onClick={() => setActiveView("agents")}>
                            {t("button.viewPerAgent")} <ArrowRight className="h-3 w-3 ml-1 inline" />
                        </Button>
                    </div>
                </div>

                {/* WhatsApp Leads Chart */}
                <div className="border border-gray-100 rounded-lg p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-medium">{t("title.whatsappLeads")}</h2>
                        <div className="relative inline-block">
                            <Select value={timeframe} onValueChange={(value) => setTimeframe(value)}>
                                <SelectTrigger className="cursor-pointer">
                                    <SelectValue placeholder={t("form.selectTimeframe.label")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">{t("form.selectTimeframe.options.weekly")}</SelectItem>
                                    <SelectItem value="monthly">{t("form.selectTimeframe.options.monthly")}</SelectItem>
                                    <SelectItem value="yearly">{t("form.selectTimeframe.options.yearly")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {leadsInsightsData?.whatsappData?.chartData && (
                        <>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                {leadsInsightsData.whatsappData.chartData.map((item: any) => (
                                    <div key={item.day + item.date} className="text-center">
                                        {item.day}
                                        <div>{item.date}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-[180px] relative">
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
                                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 10 }} />
                                        <Area
                                            type="monotone"
                                            dataKey="topLine"
                                            stroke={COLOR_DASHBOARD}
                                            strokeWidth={2}
                                            fillOpacity={0}
                                            fill="transparent"
                                        />
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
                    <div className="text-center text-xs text-gray-500 mt-2">{t("text.totalWhatsappLeadsPerDay")}</div>
                </div>

                {/* Call Data Section */}
                <div className="border border-gray-100 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-base font-medium">{t("title.callData")}</h2>
                        <DatePickerLight date={new Date(date)} setDate={(value) => setDate(value.toISOString())} />
                    </div>
                    <div className="text-center">
                        <div className="mt-6">
                            <div className="text-xs text-gray-500">{t("text.totalCalls")}</div>
                            <div className="text-4xl font-bold text-primary">
                                {groupByThreeDigits(callsData?.data?.totalCalls || 0)}
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="text-xs text-gray-500">{t("text.todaysCalls")}</div>
                            <div className="text-4xl font-bold text-primary">
                                {groupByThreeDigits(callsData?.data?.todaysCalls || 0)}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <Button variant="link" className="text-primary text-sm p-0" onClick={() => setActiveView("agents")}>
                            {t("button.viewPerAgent")} <ArrowRight className="h-3 w-3 ml-1 inline" />
                        </Button>
                    </div>
                </div>

                {/* Calls per hour Chart */}
                <div className="border border-gray-100 rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-base font-medium mb-4">{t("title.callsPerHour")}</h2>
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
                    <div className="text-center text-xs text-gray-500 mt-2">{t("text.callsPerHour")}</div>
                </div>
            </div>
        </div>
    )
}