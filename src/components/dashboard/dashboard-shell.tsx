"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { DashboardHeader } from "./dashboard-header"
import { DashboardSidebar } from "./dashboard-sidebar"

interface DashboardShellProps {
    children: ReactNode
    className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">
                <DashboardHeader />
                <main className={cn("p-6", className)}>{children}</main>
            </div>
        </div>
    )
}

