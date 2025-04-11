"use client";

import { PUBLIC_ROUTES } from "@/constants/paths";
import { useAuth } from "@/lib/hooks/useAuth";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { HeaderNavLinks } from "./header-nav-links";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./userMenu";

export default function DesktopHeader() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="hidden md:flex justify-between items-center">
        <div className="">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="PropertyExplorer"
              width={160}
              height={74}
              className="outline-none focus:outline-none"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-5 lg:space-x-8">
          <HeaderNavLinks />
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          {!isAuthenticated && (
            <Link
              href={`${PUBLIC_ROUTES.login}`}
              className="transition-colors text-sm font-medium flex items-center gap-1 hover:text-primary "
            >
              <User className="size-4" />
              {t("button.loginRegister")}
            </Link>
          )}
          <Link href={`#`} className="hidden lg:block">
            <Button size={"sm"} variant={"outline"}>
              {t("button.contactUs")}
            </Button>
          </Link>
          <LanguageSwitcher />

          {isAuthenticated && <UserMenu />}
        </div>
      </div>
    </>
  );
}
