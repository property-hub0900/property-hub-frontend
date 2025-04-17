import type React from "react";
import { MapPin, BedDouble, Bath, Ruler, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { formatAmountToQAR, formatNumber } from "@/utils/utils";
import { IProperty } from "@/types/public/properties";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PUBLIC_ROUTES } from "@/constants/paths";

export default function PropertyCard({ data }: { data: IProperty }) {
  const t = useTranslations();

  return (
    <Card className="overflow-hidden border-0 rounded-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 m-3 mb-5">
      <div className="relative overflow-hidden h-48 md:h-64">
        <Link href={`${PUBLIC_ROUTES.properties}/${data.propertyId}`}>
          <Image
            src={data?.PropertyImages[0].url}
            alt={data.title}
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        </Link>
      </div>
      <div className="p-4">
        <Link href={`${PUBLIC_ROUTES.properties}/${data.propertyId}`}>
          <h6 className="text-base font-semibold mb-0.5 truncate capitalize">
            {data.title}
          </h6>
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={16} className="shrink-0" />
            <span className="text-sm font-light truncate">{data.address}</span>
          </div>
        </Link>

        <div className="text-muted-foreground flex items-center py-2 gap-2 mb-1">
          {Number(data.bedrooms) > 0 && (
            <>
              <div className="flex items-center gap-1.5 ">
                <BedDouble className="size-4"></BedDouble>
                <span className="text-sm">{data.bedrooms}</span>
              </div>
              <span className="text-gray-300">|</span>
            </>
          )}

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bath className="size-4"></Bath>
            <span className="text-sm">{data.bathrooms}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Ruler className="size-4"></Ruler>
            <span className="text-sm">
              {formatNumber(data.propertySize)} {t("text.sqm")}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-base">
            {formatAmountToQAR(Number(data.price))}
          </span>
          <Link
            target="_blank"
            href={`https://wa.me/${data.postedByStaff?.phoneNumber}`}
          >
            <Button variant="outlinePrimary" size="sm" className="">
              <MessageCircle className="h-4 w-4" />
              {t("button.whatsapp")}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
