"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { propertyService } from "@/services/property"
import { PropertyGallery } from "@/components/property/property-gallery"
import { PropertyHeader } from "@/components/property/property-header"
import { PropertyDescription } from "@/components/property/property-description"
import { PropertyDetails } from "@/components/property/property-details"
import { PropertyAmenities } from "@/components/property/property-amenities"
import { AgentCard } from "@/components/property/agent-card"

export default function PropertyPage() {
    const params = useParams<{ id: string }>()
    const t = useTranslations("property")
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    // Fetch property data
    const {
        data: property,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["property", params.id],
        queryFn: async () => {
            try {
                const response = await propertyService.getPropertyById(params.id)
                if (!response) {
                    throw new Error("No data returned from API")
                }
                return response as any
            } catch (error) {
                console.log("Failed to fetch property:", error)
                throw error
            }
        },
    })

    // Fetch similar properties
    const { data: similarProperties = [] } = useQuery({
        queryKey: ["similarProperties", params.id],
        queryFn: async () => {
            try {
                const response = await propertyService.getSimilarProperties(params.id)
                return response || []
            } catch (error) {
                console.log("Failed to fetch similar properties:", error)
                return []
            }
        },
        enabled: !!property,
    })

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">{t("loading")}</p>
                </div>
            </div>
        )
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
        )
    }

    // Format price
    const formattedPrice = `QAR ${Number.parseInt(property.price).toLocaleString()}`

    return (
        <div className="container mx-auto px-4 py-8">
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

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <PropertyDescription property={property} t={t} />

                    <Separator className="my-6" />

                    <PropertyDetails property={property} t={t} />

                    <PropertyAmenities amenities={property.PropertyAmenities} t={t} />
                </div>

                <div className="md:col-span-1">
                    <AgentCard agent={property.postedByStaff} company={property.company} t={t} />
                </div>
            </div>

            {/* Uncomment to enable similar properties */}
            {/* <SimilarProperties properties={similarProperties} t={t} /> */}
        </div>
    )
}

