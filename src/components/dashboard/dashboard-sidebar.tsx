"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/useAuth"
import { cn } from "@/lib/utils"
import { Building2, CircleDollarSign, HelpCircle, Home, LifeBuoy, LogOut, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        name: "Property Data",
        href: "/property-data",
        icon: Building2,
    },
    {
        name: "Access Management",
        href: "/access-management",
        icon: Users,
    },
    {
        name: "Wallet Points",
        href: "/wallet",
        icon: CircleDollarSign,
    },
    {
        name: "Subscription Plans",
        href: "/subscription",
        icon: CircleDollarSign,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

const bottomNavigation = [
    {
        name: "Help Centre",
        href: "/help",
        icon: HelpCircle,
    },
    {
        name: "Contact us",
        href: "/contact",
        icon: LifeBuoy,
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const { logOut } = useAuth()

    return (
        <div className="flex flex-col border-r w-60">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Building2 className="h-6 w-6" />
                    <span>Property Hub</span>
                </Link>
            </div>
            <div className="flex-1 flex flex-col justify-between px-4 py-2">
                <nav className="space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                                pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="space-y-1">
                    {bottomNavigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                                pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                    <Button variant="ghost" className="w-full justify-start gap-3" onClick={logOut}>
                        <LogOut className="h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </div>
        </div>
    )
}

