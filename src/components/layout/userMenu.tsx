"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, Home } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { ADMIN_PATHS, COMPANY_PATHS, CUSTOMER_PATHS } from "@/constants/paths";
import { useTranslations } from "next-intl";
import { USER_ROLES } from "@/constants/rbac";

export function UserMenu() {
  const t = useTranslations();

  const { user, logOut } = useAuth();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logOut();
    setOpen(false);
  };

  const getInitials = (name: string | undefined) => {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const customerMenuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      href: `${CUSTOMER_PATHS.dashboard}`,
    },
  ];

  const companyMenuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      href: `${COMPANY_PATHS.dashboard}`,
    },
  ];

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      href: `${ADMIN_PATHS.dashboard}`,
    },
  ];

  const menuItems = {
    [USER_ROLES.CUSTOMER]: customerMenuItems,
    [USER_ROLES.OWNER]: companyMenuItems,
    [USER_ROLES.AGENT]: companyMenuItems,
    [USER_ROLES.ADMIN]: companyMenuItems,
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} alt={user?.username} />
              <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none overflow-hidden text-ellipsis">
                {user?.username}
              </p>
              {/* <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p> */}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems[user?.role as keyof typeof menuItems]?.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className="flex cursor-pointer items-center"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("button.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
