import { IPropertyAmenities } from "@/types/public/properties";
import { useTranslations } from "next-intl";

import { AmenityIcon } from "./amenity-icon";

export function PropertyAmenities({
  amenities,
}: {
  amenities: IPropertyAmenities[];
}) {
  const t = useTranslations();

  return (
    <div className="mb-8">
      <h4 className="mb-5">{t("title.amenities")}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
        {amenities.map((amenity) => (
          <div
            key={amenity.propertyAmenityId}
            className="flex items-center gap-2"
          >
            <AmenityIcon
              iconName={amenity.Amenity.icon}
              className="text-muted-foreground size-5"
            />
            <p className="font-medium">{amenity.Amenity.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
