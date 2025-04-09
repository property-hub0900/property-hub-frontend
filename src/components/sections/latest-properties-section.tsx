"use client";

import PropertyCard from "@/components/property/property-card";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { useTranslations } from "next-intl";
import { PUBLIC_ROUTES } from "@/constants/paths";
import { Swiper, SwiperSlide } from "swiper/react";

// import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import { useQuery } from "@tanstack/react-query";
import { propertyServices } from "@/services/public/properties";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
export default function LatestPropertiesSection() {
  const t = useTranslations();

  const { data: latestProperties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () =>
      propertyServices.fetchProperties({
        page: "0",
        pageSize: "10",
      }),
  });

  return (
    <section className="py-12 md:py-16 w-full overflow-hidden ">
      <div className="ps-5 lg:ps-24">
        <div className="flex flex-col md:flex-row md:items-center gap-1 justify-between mb-3 md:mb-8 pe-5 lg:pe-24">
          <h2 className="">{t("title.discoverTheLatestProperties")}</h2>
          <Link
            href={`${PUBLIC_ROUTES.properties}`}
            className="text-primary hover:text-primary/80 flex items-center text-md"
          >
            {t("button.exploreAll")} <ChevronRight size={16} />
          </Link>
        </div>
        {latestProperties?.results && latestProperties?.results.length > 0 && (
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={0}
            // pagination={{
            //   clickable: true,
            // }}
            // modules={[Pagination]}
            className="propertiesSwiper"
          >
            {latestProperties.results.map((property) => (
              <SwiperSlide
                className="!w-[340px] md:!w-[400px] md:me-2"
                key={property.propertyId}
              >
                <PropertyCard data={property} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
