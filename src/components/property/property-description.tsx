import { Button } from "@/components/ui/button"
import { PropertyDescriptionDialog } from "./property-description-dialog"

interface PropertyDescriptionProps {
    property: any
    t: any
}

export function PropertyDescription({ property, t }: PropertyDescriptionProps) {
    const propertyType = property.propertyType.toLowerCase() === "villa" ? "villa" : "property"

    // Create a formatted description without using the translation directly
    const formattedDescription = `Paragon Properties is proud to present this fully renovated ${property.bedrooms}-bedroom ${propertyType} in ${property.views}. Set within a serene gated community, this spacious home features modern architecture, high-quality finishes, and a thoughtful layout that maximizes natural light and privacy. Perfect for families or professionals, the property provides a peaceful retreat while being close to key amenities.`

    return (
        <>
            <h2 className="text-xl font-bold uppercase mb-4">
                {property.propertyType} {t("for")} {property.purpose} {t("in")} {property.views}
            </h2>

            <div className="prose max-w-none mb-6">
                <p>{property.description}</p>
                <p>{formattedDescription}</p>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold mb-2">{t("keyFeatures")}</h3>
                <ul className="space-y-1">
                    <li>- {t("features.bedrooms", { count: property.bedrooms })}</li>
                    <li>- {t("features.openPlan")}</li>
                    <li>- {t("features.furnishing", { type: property.furnishedType })}</li>
                    <li>- {t("features.views", { view: property.views.toLowerCase() })}</li>
                    <li>- {t("features.reference", { number: property.referenceNo })}</li>
                </ul>

                <PropertyDescriptionDialog property={property} t={t}>
                    <Button variant="outline" className="mt-4">
                        {t("seeFullDescription")}
                    </Button>
                </PropertyDescriptionDialog>
            </div>
        </>
    )
}

