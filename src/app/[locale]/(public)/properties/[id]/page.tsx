"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { AgentCard } from "@/components/property/agent-card";
import { PropertyAmenities } from "@/components/property/property-amenities";
import { PropertyDescription } from "@/components/property/property-description";
import { PropertyDetailFeatures } from "@/components/property/property-detail-features";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyHeader } from "@/components/property/property-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Loader } from "@/components/loader";

import { propertyServices } from "@/services/public/properties";

export default function PropertyPage() {
  const params = useParams<{ id: string }>();
  const t = useTranslations("property");

  // Fetch property data
  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", params.id],
    queryFn: () => propertyServices.getPropertyById(params.id),
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
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
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

  return (
    <div className="container mx-auto py-8 min-h-screen">
      <PropertyGallery
        images={property.PropertyImages}
        title={property.title}
      />

      <PropertyHeader
        price={property.price}
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        propertySize={property.propertySize}
      />

      <Separator className="my-6" />

      <div className="flex gap-8">
        <div className="grow">
          <h4 className="font-bold uppercase mb-4">{property.title}</h4>
          <PropertyDescription description={property.description} />

          <Separator className="my-6" />

          <PropertyDetailFeatures property={property} />

          <Separator className="my-6" />

          <PropertyAmenities amenities={property?.PropertyAmenities ?? []} />
        </div>

        <div className="w-[350px] shrink-0">
          <AgentCard
            postedByStaff={property.postedByStaff}
            company={property.company}
          />
        </div>
      </div>

      {/* Uncomment to enable similar properties */}
      {/* <SimilarProperties properties={similarProperties} t={t} /> */}
    </div>
  );
}
