"use client"

import Link from "next/link";
import { ChevronRight } from 'lucide-react';
import PropertyCard from "@/components/property/property-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

type LatestProjectsSectionProps = {
  t: any;
};

// Mock property data
const properties = [
  {
    id: 1,
    location: "New York, USA",
    price: "$5,200,000",
    beds: 8,
    rooms: 6,
    rating: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 2,
    location: "Los Angeles, USA",
    price: "$4,800,000",
    beds: 7,
    rooms: 5,
    rating: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 3,
    location: "Miami, USA",
    price: "$3,900,000",
    beds: 6,
    rooms: 4,
    rating: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 4,
    location: "Chicago, USA",
    price: "$4,100,000",
    beds: 7,
    rooms: 5,
    rating: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 5,
    location: "New York, USA",
    price: "$5,200,000",
    beds: 8,
    rooms: 6,
    rating: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 6,
    location: "Los Angeles, USA",
    price: "$4,800,000",
    beds: 7,
    rooms: 5,
    rating: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 7,
    location: "Miami, USA",
    price: "$3,900,000",
    beds: 6,
    rooms: 4,
    rating: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 8,
    location: "Chicago, USA",
    price: "$4,100,000",
    beds: 7,
    rooms: 5,
    rating: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
];

export default function LatestProjectsSection({
  t,
}: LatestProjectsSectionProps) {
  const [api, setApi] = useState<any>(null);

  // Configure carousel options
  const options = {
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: false,
  };

  // Responsive breakpoints for the carousel
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
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-16 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("latestProjects.title")}
          </h2>
          <Link
            href="/projects"
            className="text-primary hover:text-primary/80 flex items-center text-sm"
          >
            {t("latestProjects.exploreAll")} <ChevronRight size={16} />
          </Link>
        </div>

        <Carousel

          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {properties.map((property) => (
              <CarouselItem
                key={property.id}
                className={`pl-4 ${slidesInView === 1
                  ? 'basis-full'
                  : slidesInView === 2
                    ? 'basis-1/2'
                    : 'basis-1/4'
                  }`}
              >
                <PropertyCard
                  t={t}
                  location={property.location}
                  price={property.price}
                  beds={property.beds}
                  rooms={property.rooms}
                  rating={property.rating}
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