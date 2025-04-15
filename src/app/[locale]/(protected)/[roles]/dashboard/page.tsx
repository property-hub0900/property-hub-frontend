"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { AgentsInsightsView } from "@/components/dashboard/agents-insights-view"
import { LeadsInsightsView } from "@/components/dashboard/leads-insights-view"
import { PropertiesInsightsView } from "@/components/dashboard/properties-insights-view"
import { useAuth } from "@/lib/hooks/useAuth"
import { USER_ROLES } from "@/constants/rbac"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
    const [activeView, setActiveView] = useState("dashboard")
    const { user } = useAuth()

    if (user?.role === USER_ROLES.CUSTOMER) {
        return null
    }

    const insightViews = [
        { id: "properties", label: "Properties Insights" },
        { id: "agents", label: "Agents Insights" },
        { id: "leads", label: "Leads Insights" },
    ]

    return (
        <div className="mx-auto px-4 py-6">
            {activeView === "dashboard" && (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
                        <h3 className="text-xl sm:text-2xl font-bold">Dashboard</h3>

                        {/* Desktop buttons - hidden on mobile */}
                        <div className="hidden sm:flex gap-2">
                            {insightViews.map((view) => (
                                <Button
                                    key={view.id}
                                    variant="outline"
                                    className="border-primary"
                                    onClick={() => setActiveView(view.id)}
                                >
                                    {view.label}
                                </Button>
                            ))}
                        </div>

                        {/* Mobile dropdown - hidden on desktop */}
                        <div className="sm:hidden w-full">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between border-primary">
                                        Insights
                                        <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    {insightViews.map((view) => (
                                        <DropdownMenuItem key={view.id} onClick={() => setActiveView(view.id)}>
                                            {view.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <DashboardView />
                </>
            )}

            {activeView === "agents" && <AgentsInsightsView onBack={() => setActiveView("dashboard")} />}
            {activeView === "properties" && <PropertiesInsightsView onBack={() => setActiveView("dashboard")} />}
            {activeView === "leads" && <LeadsInsightsView onBack={() => setActiveView("dashboard")} />}
        </div>
    )
}
