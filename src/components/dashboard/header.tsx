"use client"

import { Bell, ChevronLeft, Menu, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserDropdown } from "../userDropdown"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export function DashboardHeader() {
    const { toggleSidebar, isMobile } = useSidebar()

    return (
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6 bg-white">
            <div className="flex items-center gap-2">
                {/* Mobile sidebar trigger */}
                <SidebarTrigger className="md:hidden mr-2" />

                {/* Desktop sidebar toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="hidden md:flex"
                >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>

                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-[200px] pl-8 bg-white border-gray-200 md:w-[300px]"
                    />
                </div>

                {/* Mobile search button */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
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
