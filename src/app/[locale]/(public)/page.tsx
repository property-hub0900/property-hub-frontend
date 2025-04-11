"use client";

import HeroSection from "@/components/sections/hero-section";
import LatestPropertiesSection from "@/components/sections/latest-properties-section";
import CtaSection from "@/components/sections/cta-section";
import AppraisalSection from "@/components/sections/appraisal-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background w-full">
      <HeroSection />
      <LatestPropertiesSection />
      <CtaSection />
      <AppraisalSection />
    </main>
  );
}
