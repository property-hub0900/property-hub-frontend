"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, Home } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { COMPANY_PATHS } from "@/constants/paths";

export function UserMenu() {
  const { user, logOut } = useAuth();
  const t = useTranslations("");

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

  const menuItems = [
    {
      label: t("userMenu.dashboard"),
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      href: `${COMPANY_PATHS.dashboard}`,
    },
    {
      label: t("sidebar.myProperties"),
      icon: <Home className="mr-2 h-4 w-4" />,
      href: `${COMPANY_PATHS.properties}`,
    },
  ];

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
          {menuItems.map((item) => (
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
            <span>{t("userMenu.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
