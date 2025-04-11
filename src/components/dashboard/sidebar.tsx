"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  COMPANY_PATHS,
  CUSTOMER_PATHS,
  PUBLIC_ROUTES,
} from "@/constants/paths";
import {
  BarChart2,
  Database,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Wallet,
  Package,
  Bell,
  Building,
  Heart,
  HelpCircle,
  MessageSquare,
  Search,
  HomeIcon,
  User2,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SidebarProps {
  userType?: "company" | "customer";
}

export function DashboardSidebar({ userType = "company" }: SidebarProps) {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const { logOut } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
    // Add console log to debug the path matching
    console.log(
      `Checking path: ${path}, current pathname: ${pathname}, normalized: ${normalizedPathname}, match: ${
        normalizedPathname === path || normalizedPathname.startsWith(`${path}/`)
      }`
    );
    return (
      normalizedPathname === path || normalizedPathname.startsWith(`${path}/`)
    );
  };

  // Company navigation items
  const companyNavItems = [
    {
      title: "Dashboard",
      href: COMPANY_PATHS.dashboard,
      icon: BarChart2,
    },
    {
      title: "Property Data",
      href: COMPANY_PATHS.properties,
      icon: Database,
    },
    {
      title: "Access Management",
      href: COMPANY_PATHS.accessManagement,
      icon: Users,
    },
    {
      title: "Points",
      href: COMPANY_PATHS.walletPoints,
      icon: Wallet,
    },
    {
      title: "Subscription Plans",
      href: COMPANY_PATHS.subscriptionPlans,
      icon: Package,
    },
    {
      title: "Top-Up",
      href: COMPANY_PATHS.topUp,
      icon: Database,
    },
    {
      title: "Settings",
      href: COMPANY_PATHS.settings,
      icon: Settings,
    },
  ];

  // Customer navigation items
  const customerNavItems = [
    {
      title: "Dashboard",
      href: CUSTOMER_PATHS.dashboard,
      icon: HomeIcon,
    },
    {
      title: "My Profile",
      href: CUSTOMER_PATHS.myProfile,
      icon: User2,
    },
    {
      title: "Saved Searched",
      href: CUSTOMER_PATHS.savedSearches,
      icon: Search,
    },
    {
      title: "Saved Properties",
      href: CUSTOMER_PATHS.savedProperties,
      icon: Heart,
      badge: 5,
    },
  ];

  // Footer items are the same for both user types
  const footerItems = [
    {
      title: "Contact us",
      href: PUBLIC_ROUTES.contact,
      icon: MessageSquare,
    },
  ];

  // Select the appropriate navigation items based on user type
  const navItems: any =
    userType === "company" ? companyNavItems : customerNavItems;

  // Determine the dashboard base path for the logo link
  // const dashboardBasePath =
  //   userType === "company" ? "/company/dashboard" : "/customer/dashboard";

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-white transition-all duration-300",
        open ? "w-92 p-4 md:p-6 lg:p-8" : "w-[78px] p-2"
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
        <Link href={"/"} className="flex items-center gap-2">
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
                src="/logo.svg"
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
          {navItems.map((item, index) => {
            const active = isActive(item.href);
            console.log(
              `Menu item ${item.title}: ${active ? "active" : "inactive"}`
            );
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  active
                    ? "text-primary font-medium bg-primary/10"
                    : "text-gray-500 hover:bg-gray-100",
                  !open && "justify-center"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    !open && "h-6 w-6",
                    active && "text-primary"
                  )}
                />
                {open && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>{item.title}</span>
                    {item?.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {item?.badge}
                      </span>
                    )}
                  </div>
                )}
                {!open && item?.badge && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {item?.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Items */}
      <div className="px-2 py-4">
        <nav className="grid gap-1">
          {footerItems.map((item, index) => {
            const active = isActive(item.href);
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  active
                    ? "text-primary font-medium bg-primary/10"
                    : "text-gray-500 hover:bg-gray-100",
                  !open && "justify-center"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    !open && "h-6 w-6",
                    active && "text-primary"
                  )}
                />
                {open && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className={cn("border-t p-4", !open && "flex justify-center")}>
        <Button
          variant="ghost"
          onClick={logOut}
          className={cn(
            "w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600",
            !open && "justify-center px-0"
          )}
        >
          <LogOut className="mr-2 h-5 w-5" />
          {open && <span>Log out</span>}
        </Button>
      </div>
    </div>
  );
}
