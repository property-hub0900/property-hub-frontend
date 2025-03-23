"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface PropertyDescriptionDialogProps {
    property: any
    t: any
    children: React.ReactNode
}

export function PropertyDescriptionDialog({ property, t, children }: PropertyDescriptionDialogProps) {
    const propertyType = property.propertyType.toLowerCase() === "villa" ? "villa" : "property";

    // Create a formatted description without using the translation directly
    const formattedDescription = `Paragon Properties is proud to present this fully renovated ${property.bedrooms}-bedroom ${propertyType} in ${property.views}. Set within a serene gated community, this spacious home features modern architecture, high-quality finishes, and a thoughtful layout that maximizes natural light and privacy. Perfect for families or professionals, the property provides a peaceful retreat while being close to key amenities.`;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{property.title}</DialogTitle>
                    <DialogDescription>
                        {property.propertyType} {t("for")} {property.purpose} {t("in")} {property.views}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <h3 className="font-semibold mb-2">Full Description</h3>
                    <div className="space-y-4 text-muted-foreground">
                        <p>{property.description}</p>
                        <p>{formattedDescription}</p>
                        <p>
                            This exceptional {property.bedrooms}-bedroom {propertyType} offers a perfect blend of comfort and style.
                            The property features spacious living areas with high ceilings and large windows that allow natural light
                            to flood the interiors. The modern kitchen is equipped with high-end appliances and ample storage space.
                        </p>
                        <p>
                            The master bedroom includes an en-suite bathroom and walk-in closet, while the additional bedrooms are
                            generously sized and well-appointed. The outdoor area includes a private garden, perfect for relaxation
                            and entertainment.
                        </p>
                        <p>
                            Located in {property.views}, residents enjoy easy access to schools, shopping centers, restaurants,
                            and recreational facilities. The community offers excellent security and a range of amenities including
                            swimming pools, fitness centers, and children's play areas.
                        </p>
                    </div>

                    <h3 className="font-semibold mt-6 mb-2">{t("keyFeatures")}</h3>
                    <ul className="space-y-1 text-muted-foreground">
                        <li>• {t("features.bedrooms", { count: property.bedrooms })}</li>
                        <li>• {t("features.openPlan")}</li>
                        <li>• {t("features.furnishing", { type: property.furnishedType })}</li>
                        <li>• {t("features.views", { view: property.views.toLowerCase() })}</li>
                        <li>• Modern kitchen with high-end appliances</li>
                        <li>• Spacious living and dining areas</li>
                        <li>• Private garden and outdoor space</li>
                        <li>• Secure parking</li>
                        <li>• Access to community amenities</li>
                        <li>• {t("features.reference", { number: property.referenceNo })}</li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    )
}

