"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/hooks/useAuth";

// Company navigation items
const companyNavItems = [
  {
    title: "Dashboard",
    href: "/company/dashboard",
    icon: BarChart2,
  },
  {
    title: "Property Data",
    href: "/company/dashboard/properties",
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
];

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
];

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
];

interface DashboardSidebarProps {
  userType?: "company" | "customer";
}

export function DashboardSidebar({
  userType = "company",
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { logOut } = useAuth();

  // Select the appropriate navigation items based on user type
  const navItems = userType === "company" ? companyNavItems : customerNavItems;

  // Determine the dashboard base path for the logo link
  const dashboardBasePath =
    userType === "company" ? "/company/dashboard" : "/customer/dashboard";

  return (
    <Sidebar className="border-r bg-white w-[240px]">
      <SidebarHeader className="py-4 border-b">
        <Link href={dashboardBasePath} className="flex items-center gap-2 px-4">
          <div className="flex items-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-current text-black"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L1 12h3v9h16v-9h3L12 2zm0 2.8L19.2 11H4.8L12 4.8z" />
            </svg>
            <div className="ml-2">
              <span className="text-base font-bold text-black">
                Property Hub
              </span>
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
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600"
                )}
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
                  item.title === "Log out" ? "text-red-500" : "text-gray-600"
                )}
              >
                <Link
                  href={item.title === "Log out" ? "#" : item.href}
                  onClick={() => {
                    if (item.title === "Log out") {
                      logOut();
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
    </Sidebar>
  );
}
