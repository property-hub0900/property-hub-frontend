"use client";

import HeroSection from "@/components/landing-page-sections/hero-section";
import LatestPropertiesSection from "@/components/landing-page-sections/latest-properties-section";
import CtaSection from "@/components/landing-page-sections/cta-section";
import AppraisalSection from "@/components/landing-page-sections/appraisal-section";

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
