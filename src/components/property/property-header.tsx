import { formatAmountToQAR, formatNumber } from "@/utils/utils";
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
    <div className="">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2 gap-3">
        <h2 className="font-bold">
          {formattedPrice}
          <span className="text-base font-normal text-muted-foreground">
            /{t("text.monthly")}
          </span>
        </h2>

        <div className="w-fit flex items-center justify-center  text-primary shadow-md px-5 py-3 gap-3 text-base  md:py-4 md:text-lg">
          {Number(bedrooms) > 0 && (
            <>
              <div className="flex items-center gap-1">
                <BedDouble className="size-4 md:size-5" />
                <span>{bedrooms}</span>
              </div>
              <span className="text-gray-200">|</span>
            </>
          )}

          <div className="flex items-center gap-1">
            <Bath className="size-4 md:size-5" />
            <span>{bathrooms}</span>
          </div>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-1">
            <Expand className="size-4 md:size-5" />
            {formatNumber(propertySize)} {t("text.sqm")}
          </div>
        </div>
      </div>
    </div>
  );
}
