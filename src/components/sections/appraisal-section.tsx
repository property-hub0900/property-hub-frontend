import { Button } from "@/components/ui/button";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function InvestSectionAlternative() {
  const t = useTranslations();

  return (
    <section className="py-12 md:py-20 w-full bg-background overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 xl:gap-16">
          <div className="w-full lg:w-[55%]">
            {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-16 bg-blue-400 rounded-r-md z-10" /> */}

            <Image
              src="/landingMarketingImg.jpg"
              alt="#"
              className="w-full object-cover"
              width={700}
              height={400}
            />
          </div>

          <div className="w-full lg:w-[40%]">
            <div className="text-base font-semibold uppercase tracking-wider mb-2">
              {t("title.investIn")}
            </div>
            <h2 className="h1 font-normal mb-5 md:mb-8">
              {t.rich("title.qatarBloomingRealEstateMarket", {
                highlight: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </h2>
            <Button className="bg-foreground text-background hover:bg-foreground/90">
              {t("button.contactUs")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
