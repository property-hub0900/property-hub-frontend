interface PropertyAmenity {
    propertyAmenityId: number
    propertyId: number
    amenityId: number
    Amenity: {
        amenityId: number
        name: string
        nameAr: string | null
        icon: string | null
    }
}

interface PropertyAmenitiesProps {
    amenities: PropertyAmenity[]
    t: any
}

export function PropertyAmenities({ amenities, t }: PropertyAmenitiesProps) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{t("amenities")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                {amenities.map((amenity) => (
                    <div key={amenity.propertyAmenityId} className="flex items-center gap-2">
                        <div className="font-medium">{amenity.Amenity.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

