import { Bed, Bath, Square } from "lucide-react"

interface PropertyHeaderProps {
    price: string
    bedrooms: number
    bathrooms: number
    propertySize: string
    t: any
}

export function PropertyHeader({ price, bedrooms, bathrooms, propertySize, t }: PropertyHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start mb-2">
            <div>
                <h1 className="text-3xl font-bold">
                    {price}
                    <span className="text-base font-normal text-muted-foreground">{t("monthly")}</span>
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>
                            {propertySize} {t("sqm")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

