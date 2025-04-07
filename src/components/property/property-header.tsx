import { formatAmountToQAR } from "@/utils/utils";
import { Bath, Bed, BedDouble, Expand } from "lucide-react";
import { useTranslations } from "next-intl";

interface PropertyHeaderProps {
  price: number;
  bedrooms?: number;
  bathrooms: number;
  propertySize: string;
}

export function PropertyHeader({
  price,
  bedrooms,
  bathrooms,
  propertySize,
}: PropertyHeaderProps) {
  const t = useTranslations();

  const formattedPrice = formatAmountToQAR(price);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-2">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="font-bold">
            {formattedPrice}
            <span className="text-base font-normal text-muted-foreground">
              /{t("text.monthly")}
            </span>
          </h2>
        </div>
        <div className="flex items-center justify-center gap-3 text-lg text-primary shadow-md px-5 py-4">
          {bedrooms && (
            <>
              <div className="flex items-center gap-1">
                <BedDouble className="size-5" />
                <span>{bedrooms}</span>
              </div>
              <span className="text-gray-200">|</span>
            </>
          )}

          <div className="flex items-center gap-1">
            <Bath className="size-5" />
            <span>{bathrooms}</span>
          </div>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-1">
            <Expand className="size-5" />
            {propertySize} {t("text.sqft")}
          </div>
        </div>
      </div>
    </div>
  );
}
