"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PropertyDescriptionDialogProps {
  property: any;
  t: any;
  children: React.ReactNode;
}

export function PropertyDescriptionDialog({
  property,
  t,
  children,
}: PropertyDescriptionDialogProps) {
  const propertyType =
    property.propertyType.toLowerCase() === "villa" ? "villa" : "property";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property.title}</DialogTitle>
          <DialogDescription>
            {property.propertyType} {t("for")} {property.purpose} {t("in")}{" "}
            {property.views}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4 text-muted-foreground">
            <div dangerouslySetInnerHTML={{ __html: property.description }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
