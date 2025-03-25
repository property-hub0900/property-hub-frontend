"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Phone,
  Mail,
  MessageCircle,
  LocateIcon,
  MapPin,
} from "lucide-react";
import { ClientProperty } from "@/types/client/properties";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

export default function PropertyListing({ data }: { data: ClientProperty }) {
  const {
    title,
    propertyType,
    PropertyImages,
    featured,
    price,
    propertySize,
    city,
    bedrooms,
    bathrooms,
  } = data;

  //const image = "/3f30036e18cdfc98064bc455840a4f07.png";

  const [currentImage, setCurrentImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const { user } = useAuth();

  // Mock multiple images with valid URLs
  const images = PropertyImages.map((img, i) => {
    // Ensure the URL is valid
    // if (img.startsWith("/3f30036e18cdfc98064bc455840a4f07.png")) {
    //   return `/3f30036e18cdfc98064bc455840a4f07.png?height=300&width=500&id=${i}`;
    // }
    return img.url;
  });

  // console.log("images", images);

  return (
    <Link href={`/properties/${data.propertyId}`}>
      <Card className="overflow-hidden grid grid-cols-3">
        <div className="relative col-span-1">
          <div className="relative h-full w-full">
            <img
              src={
                images[currentImage] ||
                "/3f30036e18cdfc98064bc455840a4f07.png?height=300&width=500"
              }
              width={500}
              height={300}
              alt={`${propertyType} property`}
              //fill
              className="object-cover h-full"
            />
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {PropertyImages.map((_, index) => (
                <button
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${currentImage === index ? "bg-white" : "bg-white/50"
                    }`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
            <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
              {currentImage + 1}/{PropertyImages.length}
            </div>
          </div>
        </div>
        <CardContent className="p-4 col-span-2">
          <div className="">
            <div>
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-lg font-medium">{propertyType}</h3>
                {featured && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-lg">★</span>{" "}
                    <span className="text-primary text-sm">Featured</span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold">{price.toLocaleString()} QAR</p>
            </div>
          </div>

          <div className="mt-2">
            <h4>{title}</h4>
            {/* <p className="text-sm">{features.join(" | ")}</p> */}
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center">
                <span className="mr-1">
                  <MapPin></MapPin>
                </span>{" "}
                {city}
              </span>
            </p>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{bedrooms} Beds</span>
            <span>|</span>
            <span>{bathrooms} Bath</span>
            <span>|</span>
            <span>{propertySize.toLocaleString()} Sqft</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </Button>
            {user?.role !== 'staff' && <Button
              variant="outline"
              size="icon"
              className={favorite ? "text-red-500" : ""}
              onClick={() => setFavorite(!favorite)}
            >
              <Heart
                className="h-4 w-4"
                fill={favorite ? "currentColor" : "none"}
                onClick={(e) => {
                  if (favorite) {
                    toast.success("Added property to favourite")
                  } else {
                    toast.success("Rmoved property from favourite")
                  }
                }
                }
              />
            </Button>}
          </div>

          {/* <div className="mt-3 text-xs text-muted-foreground">
          Posted {daysAgo} days ago
        </div> */}
        </CardContent>
      </Card>
    </Link>
  );
}
