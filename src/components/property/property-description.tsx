import { Button } from "@/components/ui/button";
import { PropertyDescriptionDialog } from "./property-description-dialog";

interface PropertyDescriptionProps {
  property: any;
  t: any;
}

export function PropertyDescription({ property, t }: PropertyDescriptionProps) {
  //   const shortDescription =
  //     getFormattedShortHTML(property.description).slice(0, 850) + "...";

  return (
    <>
      <h2 className="text-xl font-bold uppercase mb-4">{property.title}</h2>

      <div className="prose max-w-none mb-6">
        <div dangerouslySetInnerHTML={{ __html: property.description }} />
        {/* <p>{shortDescription}</p> */}
      </div>

      {/* <div className="mb-6">
        <PropertyDescriptionDialog property={property} t={t}>
          <Button variant="outline" className="mt-4">
            {t("seeFullDescription")}
          </Button>
        </PropertyDescriptionDialog>
      </div> */}
    </>
  );
}
