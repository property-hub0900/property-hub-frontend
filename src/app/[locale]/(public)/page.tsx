"use client";

import HeroSection from "@/components/sections/hero-section";
import LatestProjectsSection from "@/components/sections/latest-projects-section";
import CtaSection from "@/components/sections/cta-section";
import AppraisalSection from "@/components/sections/appraisal-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background w-full">
      <HeroSection />
      <LatestProjectsSection />
      <CtaSection />
      <AppraisalSection />
    </main>
  );
}
