"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/useAuth";
import { IProperty } from "@/types/public/properties";
import { Heart, Mail, MapPin, MessageCircle, Phone, Bath, Camera, BedDouble, Ruler, User } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  formatAmountToQAR,
  getErrorMessage,
  handleWhatsAppContent,
} from "@/utils/utils";
import { PUBLIC_ROUTES } from "@/constants/paths";
import { useLocale, useTranslations } from "next-intl";
import { USER_ROLES } from "@/constants/rbac";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyServices } from "@/services/public/properties";
import { leadsGenerationService } from "@/services/public/leads-generation";

export const PropertyListCard = ({ data }: { data: IProperty }) => {
  const t = useTranslations();

  const locale = useLocale();

  const {
    title,
    titleAr,
    propertyId,
    propertyType,
    PropertyImages,
    featured,
    price,
    hidePrice,
    propertySize,
    address,
    bedrooms,
    bathrooms,
    created_at,
    postedByStaff,
    is_favorite,
  } = data;

  const localeTitle = locale === "ar" ? titleAr : title;

  const [isFavorite, setIsFavorite] = useState(is_favorite);
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const images = PropertyImages.map((img) => img.url);
  const daysAgo = Math.floor(
    (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const postFavoritesMutation = useMutation({
    mutationKey: ["postFavorites"],
    mutationFn: propertyServices.postFavorites,
  });

  const handleCustomerFavorites = async (
    type: "add" | "remove",
    propertyId: number
  ) => {
    try {
      const response = await postFavoritesMutation.mutateAsync({
        type: type,
        propertyId: propertyId,
      });
      queryClient.invalidateQueries({ queryKey: ["getFavoriteProperties"] });
      setIsFavorite(!isFavorite);
      toast.success(response.message);
    } catch (error) {
      setIsFavorite(!isFavorite);
      toast.error(getErrorMessage(error));
    }
  };

  const handleLeadsGeneration = async (
    type: "call" | "email" | "whatsapp" | "visit"
  ) => {
    try {
      await leadsGenerationService.generateLeads({
        propertyId: data.propertyId,
        type: type,
      });
      // toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const whatsappUrl = useMemo(() => {
    return handleWhatsAppContent({
      title: localeTitle,
      propertyId: propertyId,
      phoneNumber: postedByStaff.phoneNumber,
    });
  }, []);

  return (
    <Card className="overflow-hidden flex flex-col md:flex-row">
      <div className="relative  md:w-[300px]">
        <Link href={`${PUBLIC_ROUTES.properties}/${data.propertyId}`}>
          {images.length > 0 && (
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{ clickable: true }}
              navigation
              className="h-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-full w-full select-none">
                    <Image
                      src={image || "/placeholder.svg?height=300&width=500"}
                      width={500}
                      height={300}
                      alt={`${propertyType} property`}
                      className="object-cover h-full w-full"
                      priority
                      unoptimized={false}
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
        </Link>
      </div>
      <CardContent className="p-4 grow">
        <Link href={`${PUBLIC_ROUTES.properties}/${propertyId}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-light mb-1">{propertyType}</p>

              {!hidePrice && (
                <p className="text-2xl font-bold">{formatAmountToQAR(price)}</p>
              )}
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
                <span className="text-primary">{t("text.featured")}</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-base font-medium capitalize">{localeTitle}</h2>
            <p className="mt-1 text-base font-light flex gap-1">
              <MapPin className="h-4 w-4 mt-1" />
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
              <span>
                {propertySize.toLocaleString()} {t("text.sqm")}
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link href={`tel:${postedByStaff?.phoneNumber}`}>
            <Button
              variant="outlinePrimary"
              size="sm"
              onClick={(e) => {
                handleLeadsGeneration("call");
              }}
            >
              <Phone className="h-4 w-4" />
              {t("button.call")}
            </Button>
          </Link>
          <Link href={`mailto:${postedByStaff?.user.email}`}>
            <Button
              variant="outlinePrimary"
              size="sm"
              onClick={(e) => {
                handleLeadsGeneration("email");
              }}
            >
              <Mail className="h-4 w-4" />
              {t("button.email")}
            </Button>
          </Link>
          <Link target="_blank" href={`${whatsappUrl}`}>
            <Button
              variant="outlinePrimary"
              size="sm"
              onClick={(e) => {
                handleLeadsGeneration("whatsapp");
              }}
            >
              <MessageCircle className="h-4 w-4" />
              {t("button.whatsApp")}
            </Button>
          </Link>
          {user?.role && user?.role === USER_ROLES.CUSTOMER && (
            <Button
              variant="outlinePrimary"
              size="icon"
              className={`${isFavorite
                ? "bg-primary text-primary-foreground hover:!bg-primary-foreground hover:!text-primary hover:[&>svg]:stroke-primary"
                : ""
                }`}
              onClick={() =>
                handleCustomerFavorites(
                  isFavorite ? "remove" : "add",
                  data.propertyId
                )
              }
            >
              <Heart
                className="h-4 w-4"
              // fill={isFavorite ? "currentColor" : "none"}
              />
            </Button>
          )}
        </div>

        <div className="mt-3 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-200">
              {postedByStaff?.profilePhoto ? (
                <Image
                  width={24}
                  height={24}
                  src={postedByStaff.profilePhoto || "/placeholder.svg"}
                  alt="Profile"
                  className="rounded-full"
                />
              ) : (
                <User className="size-4 text-muted-foreground/50" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {/* Listed {daysAgo} days ago */}
              {t.rich("text.listedDaysAgo", {
                highlight: () => <span>{daysAgo}</span>,
              })}
            </span>
          </div>
          {/* {postedByStaff?.profilePhoto && (
            <Image
              width={24}
              height={24}
              src={postedByStaff.profilePhoto || "/placeholder.svg"}
              alt="Profile"
              className="rounded-full"
            />
          )} */}
        </div>
      </CardContent>
    </Card>
  );
};