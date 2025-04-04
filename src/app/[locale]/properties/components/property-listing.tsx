"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/useAuth";
import { ClientProperty } from "@/types/client/properties";
import {
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Bath,
  Camera,
  CircleUser,
  BedDouble,
  Ruler,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { formatAmountToQAR } from "@/utils/utils";
import { PUBLIC_ROUTES } from "@/constants/paths";

export default function PropertyListing({ data }: { data: ClientProperty }) {
  const {
    title,
    propertyType,
    PropertyImages,
    featured,
    price,
    propertySize,
    address,
    bedrooms,
    bathrooms,
    createdAt,
    postedByStaff,
  } = data;

  const [favorite, setFavorite] = useState(false);
  const { user } = useAuth();

  const images = PropertyImages.map((img) => img.url);
  const daysAgo = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="overflow-hidden grid grid-cols-3">
      <div className="relative col-span-1">
        {images.length > 0 && (
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation
            className="h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <Image
                    src={image}
                    width={500}
                    height={300}
                    alt={`${propertyType} property`}
                    className="object-cover h-full"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className="absolute z-10 bottom-2 left-2 flex items-center text-primary gap-1 bg-white/90 rounded-sm px-2 py-1">
          <Camera className="size-4"></Camera>
          <span className="text-sm">{PropertyImages.length}</span>
        </div>
      </div>
      <CardContent className="p-4 col-span-2">
        <Link href={`${PUBLIC_ROUTES.properties}/${data.propertyId}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-light mb-1">{propertyType}</p>
              <p className="text-2xl font-bold">{formatAmountToQAR(price)}</p>
            </div>
            {featured && (
              <div className="flex items-center gap-2">
                <span className="">
                  <Image
                    width={16}
                    height={16}
                    src="/star.svg"
                    alt="Featured"
                  />
                </span>
                <span className="text-primary">Featured</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-base font-medium">{title}</h2>
            <p className="mt-1 text-base font-light flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {address}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
            {bedrooms != 0 && (
              <div className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span>{bedrooms}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4" />
              <span>{propertySize.toLocaleString()} Sqm</span>
            </div>
          </div>
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          {user?.role !== "staff" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setFavorite(!favorite);
                toast.success(
                  favorite ? "Removed from favorites" : "Added to favorites"
                );
              }}
            >
              <Heart
                className="h-4 w-4"
                fill={favorite ? "currentColor" : "none"}
              />
            </Button>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-200">
            {postedByStaff?.profilePhoto ? (
              <Image
                width={24}
                height={24}
                src={postedByStaff.profilePhoto}
                alt="Profile"
                className="rounded-full"
              />
            ) : (
              <User className="size-4 text-muted-foreground/50" />
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            Listed {daysAgo} days ago
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
