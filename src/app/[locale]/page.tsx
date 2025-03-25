"use client";

import { useTranslations } from "next-intl";
import HeroSection from "@/components/sections/hero-section";
import LatestProjectsSection from "@/components/sections/latest-projects-section";
import CtaSection from "@/components/sections/cta-section";
import AppraisalSection from "@/components/sections/appraisal-section";

export default function Home() {
  const t = useTranslations("landingPage");

  return (
    <main className="min-h-screen bg-background w-full">
      <HeroSection t={t} />
      <LatestProjectsSection t={t} />
      <CtaSection t={t} />
      <AppraisalSection t={t} />
    </main>
  );
}
