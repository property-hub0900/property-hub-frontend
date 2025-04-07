export function PropertyDescription({ description }: { description: string }) {
  //   const shortDescription =
  //     getFormattedShortHTML(property.description).slice(0, 850) + "...";

  return (
    <>
      {description && (
        <div className="prose max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: description }} />
          {/* <p>{shortDescription}</p> */}
        </div>
      )}

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
