"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { AgentsInsightsView } from "@/components/dashboard/agents-insights-view"
import { LeadsInsightsView } from "@/components/dashboard/leads-insights-view"
import { PropertiesInsightsView } from "@/components/dashboard/properties-insights-view"
import { useAuth } from "@/lib/hooks/useAuth"
import { USER_ROLES } from "@/constants/rbac"

export default function DashboardPage() {
    const [activeView, setActiveView] = useState("dashboard");
    const { user } = useAuth()

    if (user?.role === USER_ROLES.CUSTOMER) {
        return null;
    }

    return (
        <div>
            {activeView === "dashboard" && (
                <>
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-bold">Dashboard</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" className="border-primary" onClick={() => setActiveView("properties")}>
                                Properties Insights
                            </Button>
                            <Button variant="outline" className="border-primary" onClick={() => setActiveView("agents")}>
                                Agents Insights
                            </Button>
                            <Button variant="outline" className="border-primary" onClick={() => setActiveView("leads")}>
                                Leads Insights
                            </Button>
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
