interface PropertyDetailsProps {
    property: any
    t: any
}

export function PropertyDetails({ property, t }: PropertyDetailsProps) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{t("propertyDetails")}</h3>
            <div className="grid grid-cols-2 gap-y-4">
                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{t("details.propertyType")}</div>
                    <div className="font-medium">{property.propertyType}</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{t("details.propertySize")}</div>
                    <div className="font-medium">
                        {property.propertySize} {t("sqm")}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{t("details.bedrooms")}</div>
                    <div className="font-medium">{property.bedrooms}</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{t("details.bathrooms")}</div>
                    <div className="font-medium">{property.bathrooms}</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{t("details.furnishing")}</div>
                    <div className="font-medium">{property.furnishedType}</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{t("details.purpose")}</div>
                    <div className="font-medium">{property.purpose}</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{t("details.category")}</div>
                    <div className="font-medium">{property.category}</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">{t("details.referenceNo")}</div>
                    <div className="font-medium">{property.referenceNo}</div>
                </div>
            </div>
        </div>
    )
}

