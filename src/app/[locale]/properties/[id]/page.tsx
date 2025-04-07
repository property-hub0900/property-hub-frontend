"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

import { AgentCard } from "@/components/property/agent-card";
import { PropertyAmenities } from "@/components/property/property-amenities";
import { PropertyDescription } from "@/components/property/property-description";
import { PropertyDetails } from "@/components/property/property-details";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyHeader } from "@/components/property/property-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { propertyService } from "@/services/property";
import { Loader } from "@/components/loader";
import { formatAmountToQAR } from "@/utils/utils";

export default function PropertyPage() {
  const params = useParams<{ id: string }>();
  const t = useTranslations("property");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch property data
  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", params.id],
    queryFn: async () => {
      try {
        const response = await propertyService.getPropertyById(params.id);
        if (!response) {
          throw new Error("No data returned from API");
        }
        return response as any;
      } catch (error) {
        console.log("Failed to fetch property:", error);
        throw error;
      }
    },
  });

  // Fetch similar properties
  // const { data: similarProperties = [] } = useQuery({
  //     queryKey: ["similarProperties", params.id],
  //     queryFn: async () => {
  //         try {
  //             const response = await propertyService.getSimilarProperties(params.id)
  //             return response || []
  //         } catch (error) {
  //             console.log("Failed to fetch similar properties:", error)
  //             return []
  //         }
  //     },
  //     enabled: !!property,
  // })

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen">
          <Loader isLoading={true}></Loader>;
        </div>
      </>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t("notFound")}</h2>
          <p className="mt-2 text-muted-foreground">{t("notFoundDesc")}</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            {t("goBack")}
          </Button>
        </div>
      </div>
    );
  }

  // Format price
  const formattedPrice = formatAmountToQAR(property.price);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <PropertyGallery
        images={property.PropertyImages}
        title={property.title}
        activeIndex={activeImageIndex}
        onImageClick={setActiveImageIndex}
      />

      <PropertyHeader
        price={formattedPrice}
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        propertySize={property.propertySize}
        t={t}
      />

      <Separator className="my-6" />

      <div className="flex gap-8">
        <div className="grow">
          <PropertyDescription property={property} t={t} />

          <Separator className="my-6" />

          <PropertyDetails property={property} t={t} />

          <PropertyAmenities amenities={property.PropertyAmenities} t={t} />
        </div>

        <div className="w-[350px] shrink-0">
          <AgentCard
            postedByStaff={property.postedByStaff}
            company={property.company}
            t={t}
          />
        </div>
      </div>

      {/* Uncomment to enable similar properties */}
      {/* <SimilarProperties properties={similarProperties} t={t} /> */}
    </div>
  );
}
