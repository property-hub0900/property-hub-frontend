"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserDropdown } from "./userDropdown";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();



  return (
    <header className="bg-background border-b border-border w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              PropertyHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/buy"
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Buy
            </Link>
            <Link
              href="/rent"
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Rent
            </Link>
            <Link
              href="/sell"
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Sell
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              Contact
            </Link>
          </nav>

          {isAuthenticated ? (
            <>
              <UserDropdown></UserDropdown>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary/10"
                  onClick={() => router.push("/customer/login")}
                >
                  Sign In
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground p-2"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/buy"
              className="block py-2 text-muted-foreground hover:text-primary"
            >
              Buy
            </Link>
            <Link
              href="/rent"
              className="block py-2 text-muted-foreground hover:text-primary"
            >
              Rent
            </Link>
            <Link
              href="/sell"
              className="block py-2 text-muted-foreground hover:text-primary"
            >
              Sell
            </Link>
            <Link
              href="/about"
              className="block py-2 text-muted-foreground hover:text-primary"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
            <div className="pt-4 pb-2 space-y-2">
              <Button
                variant="outline"
                className="w-full text-primary border-primary hover:bg-primary/10"
                onClick={() => router.push("/customer/login")}
              >
                Sign In
              </Button>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
