"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyImage {
    url: string
    isPrimary: boolean
}

interface PropertyImagePopupProps {
    images: PropertyImage[]
    title: string
    isOpen: boolean
    onClose: () => void
    initialIndex?: number
}

export function PropertyImagePopup({ images, title, isOpen, onClose, initialIndex = 0 }: PropertyImagePopupProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    // Reset current index when popup opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex)
        }
    }, [isOpen, initialIndex])

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            window.addEventListener("keydown", handleEsc)
        }

        return () => {
            window.removeEventListener("keydown", handleEsc)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const goToImage = (index: number) => {
        setCurrentIndex(index)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
            <div
                className="relative w-full max-w-5xl p-4 bg-white rounded-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Property Images</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="relative flex-1 min-h-[50vh]">
                    <Image
                        src={images[currentIndex]?.url || "/placeholder.svg?height=600&width=800"}
                        alt={`${title} - image ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                        onClick={goToPrevious}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                        onClick={goToNext}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>

                    <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium">
                        {currentIndex + 1}/{images.length}
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <div className="flex gap-2 pb-2">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`relative w-20 h-20 flex-shrink-0 cursor-pointer ${index === currentIndex ? "ring-2 ring-primary" : ""
                                    }`}
                                onClick={() => goToImage(index)}
                            >
                                <Image
                                    src={image.url || "/placeholder.svg?height=80&width=80"}
                                    alt={`${title} - thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

