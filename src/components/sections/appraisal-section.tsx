/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

type InvestSectionProps = {
  t: any
}

export default function InvestSectionAlternative({ t }: InvestSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const imagesRef = useRef<HTMLDivElement>(null)

  const properties = [
    {
      id: 1,
      images: [
        {
          url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
          alt: "Luxury villa with garden",
        },
        {
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
          alt: "Modern apartment complex",
        },
      ],
      title: "Qatar's Blooming",
      highlight: "Real Estate",
      suffix: "Market",
      description: "Take advantage of Qatar's growing economy and invest in premium properties with high returns.",
    },
    {
      id: 2,
      images: [
        {
          url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
          alt: "Luxury apartment interior",
        },
        {
          url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
          alt: "Modern house exterior",
        },
      ],
      title: "Exclusive Properties in",
      highlight: "Premium",
      suffix: "Locations",
      description: "Find your dream property in the most sought-after locations throughout Qatar.",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % properties.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [properties.length])

  return (
    <section className="py-16 w-full bg-background overflow-hidden">
      <CustomContainer leftAligned>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Images with animation */}
          <div className="w-full lg:w-[55%] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="relative flex" ref={imagesRef}>
                  {/* Blue accent bar */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-16 bg-blue-400 rounded-r-md z-10" />

                  {/* First image (larger) */}
                  <div className="relative z-[1] rounded-lg overflow-hidden shadow-lg w-[65%] aspect-[4/3]">
                    <Image
                      src={properties[activeIndex].images[0].url || "/placeholder.svg"}
                      alt={properties[activeIndex].images[0].alt}
                      className="w-full h-full object-cover"
                      width={600}
                      height={400}
                    />
                  </div>

                  {/* Second image (smaller, overlapping) */}
                  <div className="relative -ml-8 mt-8 rounded-lg overflow-hidden shadow-lg w-[45%] aspect-[3/4] z-0">
                    <Image
                      src={properties[activeIndex].images[1].url || "/placeholder.svg"}
                      alt={properties[activeIndex].images[1].alt}
                      className="w-full h-full object-cover"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex justify-start mt-4 space-x-2">
              {properties.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    activeIndex === index ? "bg-blue-400 w-6" : "bg-gray-300 hover:bg-gray-400",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Content - No animation */}
          <div className="w-full lg:w-[40%]">
            <div className="text-sm uppercase tracking-wider mb-2">INVEST IN</div>
            <h2 className="text-4xl font-bold mb-2">
              {properties[activeIndex].title} <span className="text-blue-400">{properties[activeIndex].highlight}</span>{" "}
              {properties[activeIndex].suffix}
            </h2>
            <p className="text-muted-foreground mb-6">{properties[activeIndex].description}</p>
            <Button className="bg-foreground text-background hover:bg-foreground/90">Contact Us</Button>
          </div>
        </div>
      </CustomContainer>
    </section>
  )
}



type CustomContainerProps = {
  children: ReactNode
  className?: string
  leftAligned?: boolean
}

const CustomContainer = ({ children, className, leftAligned = false }: CustomContainerProps) => {
  return (
    <div
      className={cn(
        "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8",
        leftAligned && "lg:ml-14 lg:mr-auto lg:pl-0",
        className,
      )}
    >
      {children}
    </div>
  )
}

