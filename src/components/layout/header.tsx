"use client";
import { PROPERTY_PURPOSE } from "@/constants/constants";
import { PUBLIC_ROUTES } from "@/constants/paths";
import { useAuth } from "@/lib/hooks/useAuth";
import { Menu, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "../ui/button";
import { UserMenu } from "./userMenu";
import { HeaderNavLinks } from "./header-nav-links";
import DesktopHeader from "./desktop-header";
import MobileHeader from "./mobile-header";

export default function Header() {
  const t = useTranslations();

  return (
    <>
      {/* Main Header */}
      <header className="bg-white w-full py-1 shadow-md ">
        <div className="container mx-auto">
          <DesktopHeader />
          <MobileHeader />
        </div>
      </header>
    </>
  );
}
