"use client";

import PropertyCard from "@/components/property/property-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { PUBLIC_ROUTES } from "@/constants/paths";

// Mock property data
const properties = [
  {
    id: 1,
    title: "City Walk Phase 3 By Meraas",
    location: "New York, USA",
    price: "1212000",
    beds: 8,
    baths: 6,
    area: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 2,
    title: "City Walk Phase 3 By Meraas",
    location: "New York, USA",
    price: "1212000",
    beds: 8,
    baths: 6,
    area: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 3,
    title: "City Walk Phase 3 By Meraas",
    location: "New York, USA",
    price: "1212000",
    beds: 8,
    baths: 6,
    area: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 4,
    title: "City Walk Phase 3 By Meraas",
    location: "New York, USA",
    price: "1212000",
    beds: 8,
    baths: 6,
    area: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 5,
    title: "City Walk Phase 3 By Meraas",
    location: "New York, USA",
    price: "1212000",
    beds: 8,
    baths: 6,
    area: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
];

export default function LatestProjectsSection() {
  const t = useTranslations();
  const [slidesInView, setSlidesInView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesInView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesInView(2);
      } else {
        setSlidesInView(4);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-16 w-full overflow-hidden ">
      <div className="ps-5 lg:ps-24">
        <div className="flex items-center justify-between mb-8 pe-5 lg:pe-24">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("title.discoverTheLatestProperties")}
          </h2>
          <Link
            href={`${PUBLIC_ROUTES.properties}`}
            className="text-primary hover:text-primary/80 flex items-center text-md"
          >
            {t("button.exploreAll")} <ChevronRight size={16} />
          </Link>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="ml-0">
            {properties.map((property) => (
              <CarouselItem
                key={property.id}
                className={`pl-0 ${
                  slidesInView === 1
                    ? "basis-full"
                    : slidesInView === 2
                    ? "basis-1/2"
                    : "basis-1/4"
                }`}
              >
                <PropertyCard
                  t={t}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  beds={property.beds}
                  baths={property.baths}
                  area={property.area}
                  imageUrl={property.imageUrl}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
