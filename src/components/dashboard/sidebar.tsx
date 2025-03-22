"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart2,
    Database,
    Users,
    Wallet,
    Package,
    Settings,
    HelpCircle,
    MessageSquare,
    LogOut,
    Home,
    Heart,
    Bell,
    Search,
    Building,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/hooks/useAuth"
import Image from "next/image"

// Company navigation items
const companyNavItems = [
    {
        title: "Dashboard",
        href: "/company/dashboard",
        icon: BarChart2,
    },
    {
        title: "Property Data",
        href: "/company/dashboard/property-data",
        icon: Database,
    },
    {
        title: "Access Management",
        href: "/company/dashboard/access-management",
        icon: Users,
        badge: 1,
    },
    {
        title: "Wallet Points",
        href: "/company/dashboard/wallet-points",
        icon: Wallet,
        badge: 3,
    },
    {
        title: "Subscription Plans",
        href: "/company/dashboard/subscription-plans",
        icon: Package,
    },
    {
        title: "Settings",
        href: "/company/dashboard/settings",
        icon: Settings,
    },
]

// Customer navigation items
const customerNavItems = [
    {
        title: "Home",
        href: "/customer/dashboard",
        icon: Home,
    },
    {
        title: "Search Properties",
        href: "/customer/dashboard/search",
        icon: Search,
    },
    {
        title: "Saved Properties",
        href: "/customer/dashboard/saved",
        icon: Heart,
        badge: 5,
    },
    {
        title: "Notifications",
        href: "/customer/dashboard/notifications",
        icon: Bell,
        badge: 2,
    },
    {
        title: "My Inquiries",
        href: "/customer/dashboard/inquiries",
        icon: Building,
    },
    {
        title: "Settings",
        href: "/customer/dashboard/settings",
        icon: Settings,
    },
]

// Footer items are the same for both user types
const footerItems = [
    {
        title: "Help Centre",
        href: "/help",
        icon: HelpCircle,
    },
    {
        title: "Contact us",
        href: "/contact",
        icon: MessageSquare,
    },
    {
        title: "Log out",
        href: "/logout",
        icon: LogOut,
        className: "text-red-500 hover:text-red-600",
    },
]

interface DashboardSidebarProps {
    userType?: "company" | "customer"
}

export function DashboardSidebar({ userType = "company" }: DashboardSidebarProps) {
    const pathname = usePathname()
    const { logOut } = useAuth()

    // Select the appropriate navigation items based on user type
    const navItems = userType === "company" ? companyNavItems : customerNavItems

    // Determine the dashboard base path for the logo link
    const dashboardBasePath = userType === "company" ? "/company/dashboard" : "/customer/dashboard"

    return (
        <Sidebar className="border-r bg-white" collapsible="offcanvas">
            <SidebarHeader className="py-1.5 border-b">
                <Link href={dashboardBasePath} className="flex items-center gap-2 px-4">
                    <div className="flex items-center">

                        <div className="flex items-center">
                            <Image
                                src="/logo.svg"
                                alt="PropertyExplorer"
                                width={48}
                                height={48}
                            />

                            <div className="ml-2">
                                <div className="text-xl font-bold text-black">Property</div>
                                <div className="text-xl font-bold text-black -mt-1">Explorer</div>
                            </div>
                        </div>

                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent className="py-4">
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href} className="cursor-pointer">
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                className={cn(
                                    "gap-3 h-10 px-4",
                                    pathname === item.href ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600",
                                )}
                                tooltip={item.title}
                            >
                                <Link href={item.href}>
                                    <item.icon className="h-5 w-5 cursor-pointer" />
                                    <span>{item.title}</span>
                                    {item.badge && (
                                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="mt-auto border-t py-4">
                <SidebarMenu>
                    {footerItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                className={cn(
                                    "gap-3 h-10 px-4",
                                    item.className,
                                    item.title === "Log out" ? "text-red-500" : "text-gray-600",
                                )}
                                tooltip={item.title}
                            >
                                <Link
                                    href={item.title === "Log out" ? "#" : item.href}
                                    onClick={(e) => {
                                        if (item.title === "Log out") {
                                            e.preventDefault()
                                            logOut()
                                        }
                                    }}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

