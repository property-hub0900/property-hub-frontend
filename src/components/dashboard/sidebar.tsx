"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { useSidebar } from "@/components/ui/sidebar"
import { ADMIN_PATHS, COMPANY_PATHS, CUSTOMER_PATHS } from "@/constants/paths"
import { useAuth } from "@/lib/hooks/useAuth"
import { NAVIGATION_EVENTS, navigationEvents } from "@/lib/navigation-events"
import { cn } from "@/utils/utils"
import {
  BarChart2,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Database,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  PackagePlus,
  Search,
  Settings,
  User2,
  Users,
  Users2,
  Wallet,
  Weight,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
// Import the Tooltip components at the top with the other imports
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Import RBAC hook and permissions
import { useRBAC } from "@/lib/hooks/useRBAC"
import { useTranslations } from "next-intl"

interface SidebarProps {
  userType?: "company" | "customer"
}

export function DashboardSidebar({ userType = "company" }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { hasRoutePermission } = useRBAC()
  const { open, setOpen } = useSidebar()
  const { logOut } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const t = useTranslations()

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobile, open])

  // Determine if the screen size is mobile or tablet
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)

      // Only set the initial state if not already initialized
      if (!isInitialized) {
        setOpen(window.innerWidth >= 1024) // Open by default on large screens
        setIsInitialized(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener to update isMobile state on resize
    window.addEventListener("resize", handleResize)

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize)
  }, [isInitialized, setOpen])

  const handleToggle = () => {
    setOpen(!open)
  }

  // Check if a path is active (exact match or starts with the path)
  const isActive = (path: string) => {
    // Handle language prefix in pathname (e.g., /en/company/dashboard/top-up)
    const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/")

    if (path === "/dashboard" || path === "/company/dashboard" || path === "/admin/dashboard") {
      return normalizedPathname === path
    }

    return normalizedPathname === path || normalizedPathname.startsWith(`${path}/`)
  }

  // Handle navigation with special case for already active items
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If the item is already active, prevent default navigation and emit reset event
    if (isActive(href)) {
      e.preventDefault()

      // Emit specific reset event based on the route
      if (href === COMPANY_PATHS.accessManagement) {
        navigationEvents.emit(NAVIGATION_EVENTS.RESET_ACCESS_MANAGEMENT)
      } else if (href === COMPANY_PATHS.subscriptionPlans) {
        navigationEvents.emit(NAVIGATION_EVENTS.RESET_SUBSCRIPTION_PAGE)
      } else if (href === COMPANY_PATHS.topUp) {
        navigationEvents.emit(NAVIGATION_EVENTS.RESET_TOP_UP_PAGE)
      }

      // Use router.push with the same URL to update any query params without full refresh
      // This maintains the SPA experience while still triggering route change events
      router.push(href)
    }
  }

  const NavItems = [
    {
      title: t("sidebar.dashboard"),
      href: COMPANY_PATHS.dashboard,
      icon: BarChart2,
    },
    {
      title: t("sidebar.propertyData"),
      href: COMPANY_PATHS.properties,
      icon: Database,
    },
    {
      title: t("sidebar.accessManagement"),
      href: COMPANY_PATHS.accessManagement,
      icon: Users,
    },
    {
      title: t("sidebar.points"),
      href: COMPANY_PATHS.walletPoints,
      icon: Wallet,
    },
    {
      title: t("sidebar.subscriptionPlans"),
      href: COMPANY_PATHS.subscriptionPlans,
      icon: Package,
    },
    {
      title: t("sidebar.topUp"),
      href: COMPANY_PATHS.topUp,
      icon: Database,
    },
    {
      title: t("sidebar.settings"),
      href: COMPANY_PATHS.settings,
      icon: Settings,
    },
    // Customer Dashboard Links
    {
      title: t("sidebar.myProfile"),
      href: CUSTOMER_PATHS.myProfile,
      icon: User2,
    },
    {
      title: t("sidebar.savedSearches"),
      href: CUSTOMER_PATHS.savedSearches,
      icon: Search,
    },
    {
      title: t("sidebar.savedProperties"),
      href: CUSTOMER_PATHS.savedProperties,
      icon: Heart,
    },
    // Admin Dashboard Links
    {
      title: t("sidebar.dashboard"),
      href: ADMIN_PATHS.dashboard,
      icon: LayoutDashboard,
    },
    {
      title: t("sidebar.customersData"),
      href: ADMIN_PATHS.customersData,
      icon: Users2,
    },
    {
      title: t("sidebar.companiesData"),
      href: ADMIN_PATHS.companiesData,
      icon: BriefcaseBusiness,
    },
    {
      title: t("sidebar.propertyData"),
      href: ADMIN_PATHS.propertiesData,
      icon: Database,
    },
    {
      title: t("sidebar.subscriptionPlans"),
      href: ADMIN_PATHS.subscriptionPlans,
      icon: Package,
    },
    {
      title: t("sidebar.renewalRequests"),
      href: ADMIN_PATHS.renewalRequests,
      icon: PackagePlus,
    },
    {
      title: t("sidebar.topUpRequests"),
      href: ADMIN_PATHS.topUpRequests,
      icon: Weight,
    },
  ]

  const filteredNavItems: any = NavItems.filter((item) => {
    // Check if user has permission to access this route
    return hasRoutePermission(item.href)
  })

  const handleClose = () => {
    if (open) {
      setIsClosing(true)
      // Wait for animation to complete before actually closing
      setTimeout(() => {
        setOpen(false)
        setIsClosing(false)
      }, 300) // Match this with your transition duration
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && (open || isClosing) && (
        <div
          className={cn(
            "fixed inset-0 bg-black/20 z-45 transition-opacity duration-300",
            isClosing ? "opacity-0" : "opacity-100",
          )}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "fixed md:relative flex flex-col shrink-0 border-r bg-white transition-all duration-300 h-screen",
          open ? "left-0" : "left-[-280px] md:left-0",
          open ? "w-72 p-4 md:p-6 lg:p-8" : "md:w-[78px] md:p-2",
          "z-50", // Always keep sidebar on top
        )}
      >
        {/* Logo and close button row */}
        <div className={cn("relative flex h-0 md:h-16 items-center px-4 ease-in-out duration-400", open ? "justify-between" : "justify-center")}>
          <Link href={"/"} className="flex items-center gap-2">
            {open ? (
              <div className="hidden md:block ease-in-out duration-400">
                <Image src="/logo.svg" alt="PropertyExplorer" width={160} height={81} priority />
              </div>
            ) : (
              <Image src="/logo-without-text.svg" alt="PropertyExplorer" width={48} height={48} />
            )}
          </Link>

          {/* Close button - Only visible when sidebar is open on mobile */}
          {isMobile && open && (
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 absolute right-0">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Toggle button positioned at the edge of the sidebar - hidden on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className={cn(
            "absolute -right-4 top-12 hidden md:flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm z-50",
          )}
        >
          {open ? <ChevronLeft className="h-2 w-2" /> : <ChevronRight className="h-2 w-2" />}
        </Button>

        {/* Navigation */}
        <div
          className={cn(
            "flex-1 overflow-auto py-4 transition-opacity duration-300",
            isClosing && isMobile ? "opacity-0" : "opacity-100",
          )}
        >
          <nav className="grid gap-1 px-2">
            {filteredNavItems.map((item, index) => {
              const active = isActive(item.href)

              // When sidebar is open, render Link without Tooltip
              if (open) {
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      active ? "text-primary font-medium bg-primary/10" : "text-gray-500 hover:bg-gray-100",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", active && "text-primary")} />
                    <div
                      className={cn(
                        "flex flex-1 items-center justify-between transition-opacity duration-300",
                        isClosing ? "opacity-0" : "opacity-100",
                      )}
                    >
                      <span>{item.title}</span>
                      {item?.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                          {item?.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              }

              // When sidebar is collapsed, render Link with Tooltip
              return (
                <TooltipProvider key={index} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={(e) => handleNavigation(e, item.href)}
                        className={cn(
                          "flex items-center justify-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                          active ? "text-primary font-medium bg-primary/10" : "text-gray-500 hover:bg-gray-100",
                        )}
                      >
                        <item.icon className={cn("h-6 w-6", active && "text-primary")} />
                        {item?.badge && (
                          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                            {item?.badge}
                          </span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </nav>
        </div>

        {/* Logout button */}
        <div
          className={cn(
            "border-t p-4 transition-opacity duration-300",
            isClosing && isMobile ? "opacity-0" : "opacity-100",
          )}
        >
          {open ? (
            <Button
              variant="ghost"
              onClick={logOut}
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span
                className={cn("transition-opacity duration-300", isClosing ? "opacity-0" : "opacity-100")}
              >{t("userMenu.logout")}</span>
            </Button>
          ) : (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={logOut}
                    className="justify-center px-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{t("userMenu.logout")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </>
  )
}
