"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Loader } from "@googlemaps/js-api-loader"

interface PlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onKeyPress?: (e: React.KeyboardEvent) => void
}

export default function PlacesAutocomplete({ value, onChange, onKeyPress }: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (typeof window !== "undefined") {
      const initializeAutocomplete = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          // Initialize autocomplete only once
          if (!autocompleteRef.current && inputRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
              types: ["geocode"],
              componentRestrictions: { country: "QA" }, // Restrict to Qatar
            })

            // Add listener for place selection
            autocompleteRef.current.addListener("place_changed", () => {
              if (autocompleteRef.current) {
                const place = autocompleteRef.current.getPlace()
                if (place && place.formatted_address) {
                  onChange(place.formatted_address) // Update form field value
                }
              }
            })
          }
        }
      }

      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete()
      } else {
        // Load the Google Maps API if it's not already loaded
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
          libraries: ["places"],
        })

        loader
          .load()
          .then(() => {
            initializeAutocomplete()
          })
          .catch((e) => {
            console.error("Google Maps API failed to load", e)
          })
      }
    }

    // Cleanup function
    return () => {
      if (autocompleteRef.current && window.google.maps.event) {
        // Clean up listeners if needed
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [onChange])

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Enter location in Qatar"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyPress}
      className="pl-10" // Add padding for the search icon
    />
  )
}

