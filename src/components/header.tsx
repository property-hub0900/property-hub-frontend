"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserDropdown } from "./userDropdown";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

export default function Header({ calledBy = "home" }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const pathName = usePathname();
  const [isArabic, setIsArabic] = useState(false);

  // Determine current language from URL
  useEffect(() => {
    if (pathName.includes("/ar/")) {
      setIsArabic(true);
    } else {
      setIsArabic(false);
    }
  }, [pathName]);

  // Toggle language function
  const toggleLanguage = () => {
    const newLanguage = isArabic ? "en" : "ar";

    // Replace the language segment in the URL
    let newPath = pathName;
    if (pathName.includes("/en/")) {
      newPath = pathName.replace("/en/", `/${newLanguage}/`);
    } else if (pathName.includes("/ar/")) {
      newPath = pathName.replace("/ar/", `/${newLanguage}/`);
    } else {
      // If no language segment exists, add it after the domain
      newPath = `/${newLanguage}${pathName}`;
    }

    router.push(newPath);
  };

  if (pathName.includes("/dashboard")) {
    return null;
  }
  return (
    <>
      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="flex items-center">
                  <Image
                    src="/logo.svg"
                    alt="PropertyExplorer"
                    width={48}
                    height={48}
                  />

                  <div className="ml-2">
                    <div className="text-xl font-bold text-black">Property</div>
                    <div className="text-xl font-bold text-black -mt-1">Explorer</div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#"
                className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
              >
                Buy
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
              >
                Rent
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
              >
                Explore Properties
              </Link>
            </nav>

            {/* Auth Buttons / User Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
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

              <Link
                href="#"
                className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
              >
                Contact Us
              </Link>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {isArabic ? "AR" : "ENG"}
                </span>
                <Switch
                  checked={isArabic}
                  onCheckedChange={toggleLanguage}
                  disabled
                />
              </div>
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

              <div className="py-2 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isArabic ? "AR" : "ENG"}
                </span>
                <Switch checked={isArabic} onCheckedChange={toggleLanguage} />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
