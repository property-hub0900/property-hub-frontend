"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  COMPANY_PATHS,
  CUSTOMER_PATHS,
  PUBLIC_ROUTES,
} from "@/constants/paths";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/utils/utils";
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Database,
  Heart,
  HomeIcon,
  LogOut,
  MessageSquare,
  Package,
  Search,
  Settings,
  User2,
  Users,
  Wallet
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// Import the Tooltip components at the top with the other imports
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Import RBAC hook and permissions
import { useRBAC } from "@/lib/hooks/useRBAC";
import { useTranslations } from "next-intl";

interface SidebarProps {
  userType?: "company" | "customer";
}

export function DashboardSidebar({ userType = "company" }: SidebarProps) {
  const pathname = usePathname();
  const { hasRoutePermission } = useRBAC();
  const { open, setOpen } = useSidebar();
  const { logOut } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const t = useTranslations()

  // Determine if the screen size is mobile or tablet
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Only set the initial state if not already initialized
      if (!isInitialized) {
        setOpen(!mobile);
        setIsInitialized(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener to update isMobile state on resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [isInitialized, setOpen]);

  const handleToggle = () => {
    setOpen(!open);
  };

  // Check if a path is active (exact match or starts with the path)
  const isActive = (path: string) => {
    // Handle language prefix in pathname (e.g., /en/company/dashboard/top-up)
    const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");

    if (
      path === "/dashboard" ||
      path === "/company/dashboard" ||
      path === "/customer/dashboard"
    ) {
      return normalizedPathname === path;
    }

    return (
      normalizedPathname === path || normalizedPathname.startsWith(`${path}/`)
    );
  };

  const NavItems = [
    {
      title: t("sidebar.dashboard"),
      href: COMPANY_PATHS.dashboard,
      icon: BarChart2,
    },
    {
      title: t("sidebar.myProfile"),
      href: CUSTOMER_PATHS.myProfile,
      icon: User2,
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
      title: t("sidebar.savedSearches"),
      href: CUSTOMER_PATHS.savedSearches,
      icon: Search,
    },
    {
      title: t("sidebar.savedProperties"),
      href: CUSTOMER_PATHS.savedProperties,
      icon: Heart,
    },
    {
      title: t("sidebar.settings"),
      href: COMPANY_PATHS.settings,
      icon: Settings,
    },
  ];

  const filteredNavItems: any = NavItems.filter((item) => {
    // Check if user has permission to access this route
    return hasRoutePermission(item.href);
  });

  const footerItems = [
    {
      title: t("sidebar.contactUs"),
      href: PUBLIC_ROUTES.contact,
      icon: MessageSquare,
    },
  ];

  // Determine the dashboard base path for the logo link
  const dashboardBasePath =
    userType === "company" ? "/company/dashboard" : "/customer/dashboard";

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-white transition-all duration-300",
        open ? "w-72 p-4 md:p-6 lg:p-8" : "w-[78px] p-2"
      )}
    >
      {/* Toggle button positioned at the edge of the sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn(
          "absolute -right-4 top-20 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm"
        )}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center px-4",
          open ? "justify-start" : "justify-center"
        )}
      >
        <Link href={dashboardBasePath} className="flex items-center gap-2">
          {open ? (
            <>
              <Image
                src="/logo.svg"
                alt="PropertyExplorer"
                width={160}
                height={160}
              />
            </>
          ) : (
            <>
              <Image
                src="/logo-without-text.svg"
                alt="PropertyExplorer"
                width={48}
                height={48}
              />
            </>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {filteredNavItems.map((item, index) => {
            const active = isActive(item.href);
            console.log(
              `Menu item ${item.title}: ${active ? "active" : "inactive"}`
            );

            // When sidebar is open, render Link without Tooltip
            if (open) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    active
                      ? "text-primary font-medium bg-primary/10"
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5", active && "text-primary")}
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <span>{item.title}</span>
                    {item?.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {item?.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            }

            // When sidebar is collapsed, render Link with Tooltip
            return (
              <TooltipProvider key={index} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        active
                          ? "text-primary font-medium bg-primary/10"
                          : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      <item.icon
                        className={cn("h-6 w-6", active && "text-primary")}
                      />
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
            );
          })}
        </nav>
      </div>

      {/* Footer Items */}
      <div className="px-2 py-4">
        <nav className="grid gap-1">
          {footerItems.map((item, index) => {
            const active = isActive(item.href);

            // When sidebar is open, render Link without Tooltip
            if (open) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    active
                      ? "text-primary font-medium bg-primary/10"
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5", active && "text-primary")}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            }

            // When sidebar is collapsed, render Link with Tooltip
            return (
              <TooltipProvider key={index} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        active
                          ? "text-primary font-medium bg-primary/10"
                          : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      <item.icon
                        className={cn("h-6 w-6", active && "text-primary")}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className={cn("border-t p-4", !open && "flex justify-center")}>
        {open ? (
          <Button
            variant="ghost"
            onClick={logOut}
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>{t("userMenu.logout")}</span>
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
  );
}
