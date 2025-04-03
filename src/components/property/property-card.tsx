import type React from "react";
import {
  Bed,
  Maximize,
  MapPin,
  BedDouble,
  Bath,
  AreaChart,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { formatAmountToQAR } from "@/lib/utils";

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
          <Button
            variant="outline"
            //size=""
            className="text-primary border-primary hover:bg-primary/10 rounded-md text-xs h-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
            >
              <g clipPath="url(#clip0_331_8269)">
                <mask id="path-1-inside-1_331_8269" fill="white">
                  <path d="M9.5 0C4.26148 0 0 4.26148 0 9.5C0 11.2871 0.496558 13.0219 1.43852 14.5284C1.06327 15.8431 0.385481 18.3299 0.378173 18.3558C0.343096 18.4844 0.380731 18.6218 0.476827 18.7143C0.572923 18.8067 0.711769 18.8396 0.838192 18.8009L4.60385 17.6426C6.0789 18.5312 7.76808 19 9.5 19C14.7385 19 19 14.7385 19 9.5C19 4.26148 14.7385 0 9.5 0ZM9.5 18.2692C7.84883 18.2692 6.2404 17.8077 4.84829 16.9352C4.78946 16.8983 4.72187 16.8797 4.65427 16.8797C4.6181 16.8797 4.58192 16.8852 4.54685 16.8958L1.25875 17.9079C1.50027 17.0262 1.93435 15.4492 2.1861 14.5719C2.21533 14.4703 2.19888 14.3607 2.14152 14.2719C1.21856 12.8517 0.730769 11.2016 0.730769 9.5C0.730769 4.66487 4.66487 0.730769 9.5 0.730769C14.3351 0.730769 18.2692 4.66487 18.2692 9.5C18.2692 14.3351 14.3351 18.2692 9.5 18.2692Z" />
                </mask>
                <path
                  d="M1.43852 14.5284L2.40011 14.8029L2.52217 14.3753L2.28641 13.9983L1.43852 14.5284ZM0.378173 18.3558L-0.584401 18.0847L-0.586591 18.0927L0.378173 18.3558ZM0.838192 18.8009L1.13111 19.757L1.13219 19.7567L0.838192 18.8009ZM4.60385 17.6426L5.11987 16.786L4.73704 16.5554L4.30985 16.6868L4.60385 17.6426ZM4.84829 16.9352L4.31687 17.7823L4.31721 17.7825L4.84829 16.9352ZM4.54685 16.8958L4.25767 15.9385L4.25266 15.94L4.54685 16.8958ZM1.25875 17.9079L0.294282 17.6437L-0.186577 19.3991L1.55294 18.8636L1.25875 17.9079ZM2.1861 14.5719L1.2251 14.2954L1.22489 14.2961L2.1861 14.5719ZM2.14152 14.2719L2.98146 13.7292L2.98002 13.727L2.14152 14.2719ZM9.5 -1C3.7092 -1 -1 3.7092 -1 9.5H1C1 4.81377 4.81377 1 9.5 1V-1ZM-1 9.5C-1 11.4736 -0.451269 13.3923 0.590625 15.0586L2.28641 13.9983C1.44438 12.6516 1 11.1006 1 9.5H-1ZM0.476925 14.2539C0.104783 15.5577 -0.585689 18.0894 -0.584367 18.0847L1.34071 18.627C1.35665 18.5704 2.02176 16.1284 2.40011 14.8029L0.476925 14.2539ZM-0.586591 18.0927C-0.7175 18.5727 -0.577293 19.0878 -0.216446 19.4349L1.1701 17.9936C1.33875 18.1558 1.40369 18.3962 1.34294 18.6189L-0.586591 18.0927ZM-0.216446 19.4349C0.14116 19.779 0.657438 19.9021 1.13111 19.757L0.545272 17.8447C0.7661 17.7771 1.00469 17.8345 1.1701 17.9936L-0.216446 19.4349ZM1.13219 19.7567L4.89784 18.5984L4.30985 16.6868L0.544197 17.8451L1.13219 19.7567ZM4.08782 18.4992C5.71934 19.482 7.58704 20 9.5 20V18C7.94911 18 6.43847 17.5804 5.11987 16.786L4.08782 18.4992ZM9.5 20C15.2908 20 20 15.2908 20 9.5H18C18 14.1862 14.1862 18 9.5 18V20ZM20 9.5C20 3.7092 15.2908 -1 9.5 -1V1C14.1862 1 18 4.81377 18 9.5H20ZM9.5 17.2692C8.03582 17.2692 6.61158 16.8602 5.37937 16.0879L4.31721 17.7825C5.86922 18.7553 7.66183 19.2692 9.5 19.2692V17.2692ZM5.37971 16.0881C5.15712 15.9485 4.90445 15.8797 4.65427 15.8797V17.8797C4.53928 17.8797 4.4218 17.8481 4.31687 17.7823L5.37971 16.0881ZM4.65427 15.8797C4.517 15.8797 4.38348 15.9005 4.25767 15.9385L4.83602 17.853C4.78037 17.8698 4.71919 17.8797 4.65427 17.8797V15.8797ZM4.25266 15.94L0.96456 16.9521L1.55294 18.8636L4.84104 17.8515L4.25266 15.94ZM2.22322 18.1721C2.46504 17.2893 2.89751 15.7182 3.1473 14.8477L1.22489 14.2961C0.971184 15.1802 0.535499 16.7631 0.294282 17.6437L2.22322 18.1721ZM3.1471 14.8485C3.25673 14.4675 3.19473 14.0593 2.98146 13.7292L1.30158 14.8146C1.20304 14.6621 1.17393 14.4732 1.2251 14.2954L3.1471 14.8485ZM2.98002 13.727C2.16298 12.4698 1.73077 11.0091 1.73077 9.5H-0.269231C-0.269231 11.3941 0.274132 13.2336 1.30302 14.8168L2.98002 13.727ZM1.73077 9.5C1.73077 5.21715 5.21715 1.73077 9.5 1.73077V-0.269231C4.11258 -0.269231 -0.269231 4.11258 -0.269231 9.5H1.73077ZM9.5 1.73077C13.7828 1.73077 17.2692 5.21715 17.2692 9.5H19.2692C19.2692 4.11258 14.8874 -0.269231 9.5 -0.269231V1.73077ZM17.2692 9.5C17.2692 13.7828 13.7828 17.2692 9.5 17.2692V19.2692C14.8874 19.2692 19.2692 14.8874 19.2692 9.5H17.2692Z"
                  fill="#4AA0D9"
                  mask="url(#path-1-inside-1_331_8269)"
                />
                <path
                  d="M4.36173 8.27308L4.14625 8.35599C4.14624 8.35598 4.14624 8.35597 4.14623 8.35596C3.71719 7.24033 3.9474 6.21618 4.31766 5.43258C4.60541 4.82358 4.96776 4.38379 5.12905 4.20389C5.15162 4.17871 5.17025 4.15863 5.18419 4.14388L4.36173 8.27308Z"
                  stroke="#4AA0D9"
                />
              </g>
              <defs>
                <clipPath id="clip0_331_8269">
                  <rect width="19" height="19" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {t("button.whatsapp")}
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
