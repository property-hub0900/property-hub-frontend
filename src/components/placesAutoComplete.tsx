"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PlacesAutocomplete({
  value,
  onChange,
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(
      inputRef.current!,
      {
        types: ["geocode"],
        componentRestrictions: { country: "QA" }, // Restrict to Qatar
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        onChange(place.formatted_address); // Update form field value
      }
    });
  }, [onChange]);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder=""
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
