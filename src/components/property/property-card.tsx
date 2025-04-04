import type React from "react";
import { MapPin, BedDouble, Bath, Ruler, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { formatAmountToQAR } from "@/utils/utils";

type PropertyCardProps = {
  t: any;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: number;
  imageUrl: string;
};

export default function PropertyCard({
  t,
  title,
  location,
  price,
  beds,
  baths,
  area,
  imageUrl,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden border-0 rounded-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 m-3 mb-5">
      <div className="relative overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={"#"}
          className="w-full h-full object-cover"
          width={500}
          height={500}
        />
      </div>
      <div className="p-4">
        <h6 className="text-base font-semibold mb-0.5">{title}</h6>
        <div className="flex items-center mb-1">
          <MapPin size={16} className=" mr-1" />
          <span className="text-sm font-light">{location}</span>
        </div>

        <div className="text-muted-foreground flex items-center py-2 gap-2 mb-1">
          <div className="flex items-center gap-1.5 ">
            <BedDouble className="size-4"></BedDouble>
            <span className="text-sm">{beds}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bath className="size-4"></Bath>
            <span className="text-sm">{baths}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Ruler className="size-4"></Ruler>
            <span className="text-sm">{area} Sqft</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-base">
            {formatAmountToQAR(Number(price))}
          </span>
          <Button variant="outlinePrimary" size="sm" className="">
            <MessageCircle className="h-4 w-4" />
            {t("button.whatsapp")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// function PropertyFeature({
//   icon,
//   text,
// }: {
//   icon: React.ReactNode;
//   text: string;
// }) {
//   return (
//     <div className="flex items-center gap-1">
//       <div className="text-muted-foreground">{icon}</div>
//       <span className="text-sm">{text}</span>
//     </div>
//   );
// }
