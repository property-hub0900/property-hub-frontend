"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader } from "@googlemaps/js-api-loader";

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export default function PlacesAutocomplete({
  value,
  onChange,
  onKeyPress,
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const onChangeRef = useRef(onChange);

  // Update the ref whenever onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    console.log("PlacesAutocomplete useEffect");

    const initializeAutocomplete = () => {
      if (!autocompleteRef.current && inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
            componentRestrictions: { country: "QA" },
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          console.log("Place selected");
          const place = autocompleteRef.current?.getPlace();
          if (place?.formatted_address) {
            // Use the ref to call the latest onChange
            onChangeRef.current(place.formatted_address);
          }
        });
      }
    };

    if (typeof window !== "undefined") {
      if (window.google?.maps?.places) {
        initializeAutocomplete();
      } else {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
          libraries: ["places"],
        });

        loader
          .load()
          .then(() => {
            initializeAutocomplete();
          })
          .catch(console.error);
      }
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, []); // Empty dependency array ensures this runs once

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Enter location in Qatar"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyPress}
      className="pl-10"
    />
  );
}
