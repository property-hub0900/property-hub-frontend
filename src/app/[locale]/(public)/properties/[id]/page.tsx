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
import { SimilarProperties } from "@/components/property/similar-properties";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PropertyPage() {
  const params = useParams<{ id: string }>();
  const t = useTranslations();

  // Fetch property data
  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", params.id],
    queryFn: () => propertyServices.getPropertyById(params.id),
  });

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
          <Alert variant="destructive" className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("text.error")}</AlertTitle>
            <AlertDescription>{t("text.failedToFetch")}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => window.history.back()}>
            {t("button.goBack")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto pt-8 min-h-screen">
        <PropertyGallery
          propertyId={property.propertyId}
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

        <div className="flex flex-col gap-4 xl:gap-8 xl:flex-row ">
          <div className="grow">
            <h4 className="font-bold uppercase mb-4">{property.title}</h4>
            <PropertyDescription description={property.description} />

            <Separator className="my-6" />

            <PropertyDetailFeatures property={property} />

            <Separator className="my-6" />

            <PropertyAmenities amenities={property?.PropertyAmenities ?? []} />

            <Separator className="my-6 xl:hidden" />
          </div>

          <div className="w-full md:max-w-[550px] mx-auto shrink-0 xl:max-w-[350px]">
            <AgentCard
              postedByStaff={property.postedByStaff}
              company={property.company}
            />
          </div>
        </div>
        <Separator className="my-6" />
      </div>

      <SimilarProperties />
    </>
  );
}
