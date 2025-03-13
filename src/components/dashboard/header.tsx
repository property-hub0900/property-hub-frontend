"use client"

import { Bell, Search } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserDropdown } from "../userDropdown"

export function DashboardHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b px-6 bg-white">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-[300px] pl-8 bg-white border-gray-200"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
                </Button>
                <UserDropdown />
            </div>
        </header>
    )
}
