import type React from "react";
import { Bed, Maximize, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

type PropertyCardProps = {
  t: any;
  location: string;
  price: string;
  beds: number;
  rooms: number;
  rating: number;
  imageUrl: string;
};

export default function PropertyCard({
  t,
  location,
  price,
  beds,
  rooms,
  rating,
  imageUrl,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden border border-border rounded-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={t("property.imageAlt")}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <MapPin size={16} className="text-muted-foreground mr-1" />
            <span className="text-sm font-medium">{location}</span>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-t border-b border-border my-2">
          <PropertyFeature icon={<Bed size={16} />} text={`${beds} Bed`} />
          <PropertyRating rating={rating} />
          <PropertyFeature
            icon={<Maximize size={16} />}
            text={`${rooms} Room`}
          />
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-lg">{price}</span>
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary/10 rounded-md text-xs h-8"
          >
            {t("property.contactNow")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PropertyFeature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function PropertyRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 bg-muted flex items-center justify-center rounded-sm">
        <span className="text-xs">{rating}</span>
      </div>
      <span className="text-sm">/10</span>
    </div>
  );
}
