import { Bath, Bed } from "lucide-react"

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
            <div className="flex justify-between items-center w-full">
                <div>
                    <h1 className="text-3xl font-bold">
                        {price}
                        <span className="text-base font-normal text-muted-foreground">{t("monthly")}</span>
                    </h1>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 text-sm text-primary px-4 py-2 shadow-md ">
                    <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="mt-2">

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>
                        </div>
                        <span>
                            {propertySize} {t("sqm")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

