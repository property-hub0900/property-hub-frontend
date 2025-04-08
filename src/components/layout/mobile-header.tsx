"use client";
import { PUBLIC_ROUTES } from "@/constants/paths";
import { useAuth } from "@/lib/hooks/useAuth";
import { Menu, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./userMenu";
import { HeaderNavLinks } from "./header-nav-links";

export default function MobileHeader() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className=" flex justify-between items-center md:hidden  ">
        {/* Mobile Menu Button */}
        <div className="flex-1/4 ">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="grow">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="PropertyExplorer"
              width={140}
              height={64}
              className="outline-none focus:outline-none"
            />
          </Link>
        </div>

        <div className="flex items-center justify-end flex-1/4">
          <LanguageSwitcher />
          {isAuthenticated && <UserMenu />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[82px] h-screen w-full px-8 z-50 md:hidden bg-white border-t border-gray-200">
          <div className="py-8 space-y-3 [&>a]:block [&>a]:text-base">
            <HeaderNavLinks />
            <Link
              href="#"
              className="transition-colors text-sm font-medium hover:text-primary"
            >
              {t("button.contactUs")}
            </Link>

            {!isAuthenticated && (
              <Link
                href={`${PUBLIC_ROUTES.login}`}
                className="transition-colors text-sm font-medium hover:text-primary"
              >
                {t("button.loginRegister")}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
