"use client";

import PropertyCard from "@/components/property/property-card";
import { propertyServices } from "@/services/public/properties";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

export const SimilarProperties = () => {
  const t = useTranslations();

  const { data: similarProperties } = useQuery({
    queryKey: ["similarProperties"],
    queryFn: () => propertyServices.getSimilarProperties(),
  });

  return (
    <section className="pt-2 lg:pt-8 pb-10 lg:pb-16 w-full overflow-hidden ">
      <div className="container mx-auto">
        <h3 className="mb-3 md:mb-5">{t("title.moreAvailableInSameArea")}</h3>
      </div>
      <div className="ps-5 md:ps-10 xl:ps-24">
        {similarProperties?.results &&
          similarProperties?.results.length > 0 && (
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={0}
              className="propertiesSwiper"
            >
              {similarProperties.results.map((property) => (
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
};
