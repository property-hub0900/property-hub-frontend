import { IPropertyAmenities } from "@/types/client/properties";
import { useTranslations } from "next-intl";

export function PropertyAmenities({
  amenities,
}: {
  amenities: IPropertyAmenities[];
}) {
  const t = useTranslations();
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{t("title.amenities")}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
        {amenities.map((amenity) => (
          <div
            key={amenity.propertyAmenityId}
            className="flex items-center gap-2"
          >
            <div className="font-medium">{amenity.Amenity.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
