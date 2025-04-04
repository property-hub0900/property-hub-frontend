"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserMenu } from "./userMenu";
import Image from "next/image";
import { PUBLIC_ROUTES } from "@/constants/paths";
import { PROPERTY_PURPOSE } from "@/constants/constants";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";

export default function Header() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const pathName = usePathname();

  if (pathName.includes("/dashboard")) {
    return null;
  }

  return (
    <>
      {/* Main Header */}
      <header className="bg-white w-full py-1 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.svg"
                  alt="PropertyExplorer"
                  width={160}
                  height={70}
                  className="outline-none focus:outline-none"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href={`${PUBLIC_ROUTES.properties}?purpose=${PROPERTY_PURPOSE[0]}`}
                className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
              >
                {t("button.buy")}
              </Link>
              <Link
                href={`${PUBLIC_ROUTES.properties}?purpose=${PROPERTY_PURPOSE[1]}`}
                className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
              >
                {t("button.rent")}
              </Link>
              <Link
                href={PUBLIC_ROUTES.properties}
                className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
              >
                {t("button.exploreProperties")}
              </Link>
            </nav>

            {/* Auth Buttons / User Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {!isAuthenticated && (
                <Link
                  href="/customer/login"
                  className="text-gray-700 hover:text-primary transition-colors text-sm font-medium flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Login/Register
                </Link>
              )}

              <Link href="#" className="">
                <Button size={"sm"} variant={"outline"}>
                  Contact Us
                </Button>
              </Link>

              <LanguageSwitcher />

              {isAuthenticated && <UserMenu />}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 p-2"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <Link
                href="#"
                className="block py-2 text-gray-700 hover:text-primary"
              >
                Buy
              </Link>
              <Link
                href="#"
                className="block py-2 text-gray-700 hover:text-primary"
              >
                Rent
              </Link>
              <Link
                href="#"
                className="block py-2 text-gray-700 hover:text-primary"
              >
                Explore Properties
              </Link>
              <Link
                href="/contact"
                className="block py-2 text-gray-700 hover:text-primary"
              >
                Contact Us
              </Link>

              {!isAuthenticated && (
                <Link
                  href="/customer/login"
                  className="block py-2 text-gray-700 hover:text-primary"
                >
                  Login/Register
                </Link>
              )}

              <div className="py-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
