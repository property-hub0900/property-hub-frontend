import Image from "next/image"
import { Bed, Bath, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface SimilarPropertiesProps {
    properties: any[]
    t: any
}

export function SimilarProperties({ properties, t }: SimilarPropertiesProps) {
    if (properties?.length > 0) {
        return (
            <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6">{t("similarProperties")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {properties.map((property) => (
                        <Card key={property.propertyId} className="overflow-hidden">
                            <div className="relative h-48">
                                <Image
                                    src={property.PropertyImages?.[0]?.url || "/placeholder.svg?height=200&width=300"}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="p-4">
                                <h4 className="font-semibold truncate">{property.title}</h4>
                                <p className="text-sm text-muted-foreground truncate">{property.views}</p>
                                <p className="text-primary font-bold mt-2">QAR {Number.parseInt(property.price).toLocaleString()}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Bed className="h-4 w-4" />
                                    <span>{property.bedrooms}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Bath className="h-4 w-4" />
                                    <span>{property.bathrooms}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Square className="h-4 w-4" />
                                    <span>
                                        {property.propertySize} {t("sqm")}
                                    </span>
                                </div>
                                <Button size="sm" variant="outline" className="ml-auto">
                                    {t("contact.whatsApp")}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">{t("similarProperties")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="relative h-48">
                            <Image
                                src={`/placeholder.svg?height=200&width=300&text=Property ${index}`}
                                alt={`Similar Property ${index}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardContent className="p-4">
                            <h4 className="font-semibold truncate">City Walk Phase {index}</h4>
                            <p className="text-sm text-muted-foreground truncate">Dubai, City Walk, Phase {index}</p>
                            <p className="text-primary font-bold mt-2">QAR {(195000 + index * 100000).toLocaleString()}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                <span>{index + 1}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Bath className="h-4 w-4" />
                                <span>{index}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Square className="h-4 w-4" />
                                <span>3,380 {t("sqm")}</span>
                            </div>
                            <Button size="sm" variant="outline" className="ml-auto">
                                {t("contact.whatsApp")}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

