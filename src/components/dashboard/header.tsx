"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { USER_ROLES } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";
import { cn } from "@/utils/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserMenu } from "../layout/userMenu";
import NotificationDropdown from "./notifications";

export function DashboardHeader() {
  const { currentRole } = useRBAC();

  const { open, setOpen, toggleSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b p-4 md:p-6 bg-white",
        isMobile && "sticky top-0 z-40 w-full"
      )}
    >
      {/* Left side with burger menu on mobile */}
      <div className="flex items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
      </div>

      {/* Center with logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <Link href="/" className="flex items-center md:hidden">
          <Image
            src="/logo.svg"
            alt="PropertyExplorer"
            width={100}
            height={100}
            priority
          />
        </Link>
      </div>

      {/* Right side with notifications and user menu */}
      <div className="flex items-center gap-4">
        {currentRole === USER_ROLES.CUSTOMER && <NotificationDropdown />}

        <UserMenu />
      </div>
    </header>
  );
}
