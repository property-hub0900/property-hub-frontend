/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyGalleryPopup } from "./property-gallery-popup";

interface PropertyImage {
  url: string;
  isPrimary: boolean;
}

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
  // activeIndex: number;
  // onImageClick: (index: number) => void;
}

export function PropertyGallery({
  images,
  title,
}: // activeIndex,
// onImageClick,
PropertyGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const primaryImage = images[0];

  const otherImages = images.slice(1, 3);

  //   images[0] || {
  //     url: "/placeholder.svg?height=600&width=800",
  //     isPrimary: false,
  //   };

  // Get primary image or first image
  // const primaryImage = images.find((img) => img.isPrimary) ||
  //   images[0] || {
  //     url: "/placeholder.svg?height=600&width=800",
  //     isPrimary: false,
  //   };

  // Get other images
  // const otherImages = images
  //   .filter((img) => img !== images.find((i) => i.isPrimary))
  //   .slice(0, 2);

  // // If we don't have enough images, add placeholders
  // while (otherImages.length < 2) {
  //   otherImages.push({
  //     url: "/placeholder.svg?height=300&width=400",
  //     isPrimary: false,
  //   });
  // }

  const openPopup = (index: number) => {
    setActiveImageIndex(index);
    setIsPopupOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        <div
          className="md:col-span-2 relative h-[300px] md:h-[500px] group cursor-pointer"
          onClick={() => openPopup(0)}
        >
          <Image
            src={primaryImage.url}
            alt={title}
            fill
            className="object-cover rounded-l-xl"
          />
          <div className="absolute z-10 bottom-2 right-2 flex items-center gap-2">
            <div className="flex items-center text-primary gap-1 bg-white/90 rounded-sm px-3 h-9">
              <Camera className="size-5"></Camera>
              <span className="">{images.length}</span>
            </div>
            <Button
              size="icon"
              className="bg-white/90 hover:bg-primary text-muted-foreground hover:text-primary-foreground"
              onClick={(e) => {
                e.stopPropagation();
                // Add favorite functionality here
              }}
            >
              <Heart className="h-5 w-5" />
            </Button>
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
                className={`object-cover ${
                  index === 0 ? "rounded-tr-xl" : "rounded-br-xl"
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
