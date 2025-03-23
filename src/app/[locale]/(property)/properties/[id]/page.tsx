"use cleient";
import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { propertyService } from "@/services/property"
import { properties } from "@/data/properties";

type PropertyPageProps = {
    params: {
        id: string
        locale: string
    }
}



async function getProperty(id: string) {
    try {
        const response = await propertyService.getPropertyById(id)
        return response.data
    } catch (error) {
        throw new Error("Failed to fetch property")
    }
}

async function getSimilarProperties(id: string) {
    try {
        const response = await propertyService.getSimilarProperties(id)
        return response.data
    } catch (error) {
        return []
    }
}

export default function PropertyPage({ params }: PropertyPageProps) {

    // let similarProperties = []

    // try {
    //     property = await getProperty(params.id)
    //     similarProperties = await getSimilarProperties(params.id)
    // } catch (error) {
    //     notFound()
    // }

    // Format currency
    const formatCurrency = (amount: number) => {
        return `QAR ${amount}`
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Property Images Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
                <div className="md:col-span-2 relative h-[300px] md:h-[400px]">
                    <Image
                        src={"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80"}
                        alt={properties.title}
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="hidden md:grid grid-rows-2 gap-2">
                    <div className="relative">
                        <Image
                            src={"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80"}
                            alt={properties.title}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                    <div className="relative">
                        <Image
                            src={"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80"}
                            alt={properties.title}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                </div>
            </div>

            {/* Property Header */}
            <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{formatCurrency(properties.price)}</h1>
                    <h2 className="text-xl font-semibold mt-2">{properties.title}</h2>
                    <p className="text-muted-foreground">{properties.location}</p>
                </div>
                <div className="flex items-start mt-4 md:mt-0">
                    <div className="flex items-center">
                        <div className="relative w-12 h-12 mr-3">
                            <Image
                                src={properties.agent?.avatar || "/placeholder.svg?height=50&width=50"}
                                alt={properties.agent?.name || "Agent"}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-medium">{properties.agent?.name || "Agent Name"}</p>
                            <Button size="sm" variant="outline" className="mt-1">
                                Contact
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Description */}
            <div className="mb-8">
                <p className="text-muted-foreground">{properties.description}</p>
            </div>

            {/* Property Details */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Property details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Property Type</span>
                        <span className="font-medium">{properties.propertyType}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Bedrooms</span>
                        <span className="font-medium">{properties.bedrooms}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Bathrooms</span>
                        <span className="font-medium">{properties.bathrooms}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Built Area</span>
                        <span className="font-medium">{properties.area} sqft</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Purpose</span>
                        <span className="font-medium capitalize">{properties.purpose}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Furnishing</span>
                        <span className="font-medium">{properties.furnishing || "Not furnished"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Parking</span>
                        <span className="font-medium">{properties.parking || "Not available"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Reference</span>
                        <span className="font-medium">{properties.reference || properties.id}</span>
                    </div>
                </div>
            </div>

            {/* Amenities */}
            {properties.amenities && properties.amenities.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                        {properties.amenities.map((amenity: any) => (
                            <Badge key={amenity.id} variant="outline" className="px-3 py-1">
                                {amenity.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <Separator className="my-8" />

            {/* Similar Properties */}
            {/* {similarProperties.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">More available in your area</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {similarProperties.map((similarProperty: any) => (
                            <Card key={similarproperties.id} className="overflow-hidden">
                                <div className="relative h-40">
                                    <Image
                                        src={similarproperties.images[0]?.url || "/placeholder.svg?height=160&width=300"}
                                        alt={similarproperties.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold truncate">{similarproperties.title}</h4>
                                    <p className="text-primary font-bold mt-1">{formatCurrency(similarproperties.price)}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                                    <span>{similarproperties.bedrooms} beds</span>
                                    <span>{similarproperties.bathrooms} baths</span>
                                    <span>{similarproperties.area} sqft</span>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    )
}

