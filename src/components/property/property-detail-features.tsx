import { IProperty } from "@/types/public/properties";
import { formatNumber } from "@/utils/utils";
import {
  Bath,
  BedDouble,
  Building2,
  ChartColumnStacked,
  Expand,
  IdCard,
  LampCeiling,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface PropertyDetailsProps {
  property: IProperty;
}

export function PropertyDetailFeatures({ property }: PropertyDetailsProps) {
  const t = useTranslations();
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">
        {t("title.propertyDetails")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-center text-muted-foreground">
            <ChartColumnStacked className="size-5" />
            {t("form.propertyCategory.label")}
          </div>
          <div className="font-medium">{property.category}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-center text-muted-foreground">
            <ShoppingBag className="size-5" />
            {t("form.propertyPurpose.label")}
          </div>
          <div className="font-medium">{property.purpose}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-center text-muted-foreground">
            <Building2 className="size-5" />
            {t("form.propertyType.label")}
          </div>
          <div className="font-medium">{property.propertyType}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-center text-muted-foreground">
            <Expand className="size-5" />
            {t("form.propertySize.label")}
          </div>
          <div className="font-medium">
            {formatNumber(property.propertySize)} {t("text.sqft")}
          </div>
        </div>
        {property.bedrooms && property.bedrooms > 0 && (
          <div className="grid grid-cols-2 gap-2">
            <div className="flex gap-2 items-center text-muted-foreground">
              <BedDouble className="size-5" />
              {t("form.bedrooms.label")}
            </div>
            <div className="font-medium">{formatNumber(property.bedrooms)}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-center text-muted-foreground">
            <Bath className="size-5" />
            {t("form.bathrooms.label")}
          </div>
          <div className="font-medium">{property.bathrooms}</div>
        </div>
        {property.furnishedType && (
          <div className="grid grid-cols-2 gap-2">
            <div className="flex gap-2 items-center text-muted-foreground">
              <LampCeiling className="size-5" />
              {t("form.furnishedType.label")}
            </div>
            <div className="font-medium">{property.furnishedType}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-center text-muted-foreground">
            <IdCard className="size-5" />
            {t("form.referenceNo.label")}
          </div>
          <div className="font-medium">{property.referenceNo}</div>
        </div>
      </div>
    </div>
  );
}
