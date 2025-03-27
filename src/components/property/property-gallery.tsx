/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyImagePopup } from "./property-image-popup"

interface PropertyImage {
    url: string
    isPrimary: boolean
}

interface PropertyGalleryProps {
    images: PropertyImage[]
    title: string
    activeIndex: number
    onImageClick: (index: number) => void
}

export function PropertyGallery({ images, title, activeIndex, onImageClick }: PropertyGalleryProps) {
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    // Get primary image or first image
    const primaryImage = images.find((img) => img.isPrimary) ||
        images[0] || { url: "/placeholder.svg?height=600&width=800", isPrimary: false }

    // Get other images
    const otherImages = images.filter((img) => img !== images.find((i) => i.isPrimary)).slice(0, 2)

    // If we don't have enough images, add placeholders
    while (otherImages.length < 2) {
        otherImages.push({ url: "/placeholder.svg?height=300&width=400", isPrimary: false })
    }

    const openPopup = (index: number) => {
        onImageClick(index)
        setIsPopupOpen(true)
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
                <div
                    className="md:col-span-2 relative h-[300px] md:h-[400px] group cursor-pointer"
                    onClick={() => openPopup(activeIndex)}
                >
                    <Image
                        src={images[activeIndex]?.url || primaryImage.url}
                        alt={title}
                        fill
                        className="object-cover rounded-l-xl"
                    />
                    <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 flex items-center gap-1">
                        <Camera className="h-4 w-4" />
                        <span className="text-sm">{images.length}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-3 bg-white/80 hover:bg-white rounded-full"
                        onClick={(e) => {
                            e.stopPropagation()
                            // Add favorite functionality here
                        }}
                    >
                        <Heart className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
                <div className="hidden md:grid grid-rows-2 gap-2">
                    {otherImages.map((image, index) => (
                        <div key={index} className="relative cursor-pointer" onClick={() => openPopup(index + 1)}>
                            <Image
                                src={image.url || "/placeholder.svg"}
                                alt={`${title} - view ${index + 1}`}
                                fill
                                className={`object-cover ${index === 0 ? "rounded-tr-xl" : "rounded-br-xl"}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <PropertyImagePopup
                images={images}
                title={title}
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                initialIndex={activeIndex}
            />
        </>
    )
}

