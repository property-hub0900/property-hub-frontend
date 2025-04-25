/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyGalleryPopup } from "./property-gallery-popup";
import { IPropertyImages } from "@/types/public/properties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyServices } from "@/services/public/properties";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { USER_ROLES } from "@/constants/rbac";

interface PropertyGalleryProps {
  propertyId: number;
  images: IPropertyImages[];
  title: string;
}

export function PropertyGallery({
  propertyId,
  images,
  title,
}: PropertyGalleryProps) {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const [isFavorite, setIsFavorite] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const primaryImage = images[0];

  const otherImages = images.slice(1, 3);

  const openPopup = (index: number) => {
    setActiveImageIndex(index);
    setIsPopupOpen(true);
  };

  const postFavoritesMutation = useMutation({
    mutationKey: ["postFavorites"],
    mutationFn: propertyServices.postFavorites,
  });

  const handleCustomerFavorites = async (type: "add" | "remove") => {
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        <div
          className="md:col-span-2 relative h-[300px] md:h-[500px] group cursor-pointer"
          onClick={() => openPopup(0)}
        >
          <Image
            src={primaryImage?.url || "/placeholder.svg?height=80&width=80"}
            alt={title}
            className="object-cover rounded-xl md:rounded-r-none "
            fill
            priority
          />
          <div className="absolute z-10 bottom-2 right-2 flex items-center gap-2">
            <div className="flex items-center text-primary gap-1 bg-white/90 rounded-sm px-3 h-9">
              <Camera className="size-5"></Camera>
              <span className="">{images.length}</span>
            </div>
            {user?.role && user?.role === USER_ROLES.CUSTOMER && (
              <Button
                type="button"
                size="icon"
                className={`bg-white/90 hover:bg-primary text-muted-foreground hover:text-primary-foreground ${isFavorite
                  ? "bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  : ""
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomerFavorites(isFavorite ? "remove" : "add");
                }}
              >
                <Heart className={`h-5 w-5`} />
              </Button>
            )}
          </div>
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2">
          {otherImages.map((image, index) => (
            <div
              key={index}
              className="relative cursor-pointer h-full"
              onClick={() => openPopup(0)}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={`${title} - view ${0}`}
                fill
                className={`object-cover ${index === 0 ? "rounded-tr-xl" : "rounded-br-xl"
                  }`}
              />
            </div>
          ))}
        </div>
      </div>

      <PropertyGalleryPopup
        images={images}
        title={title}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        initialIndex={activeImageIndex}
      />
    </>
  );
}
