/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { X, Loader2, Search } from "lucide-react";
import { cn } from "@/utils/utils";

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  className?: string;
}

// Declare google variable
declare global {
  interface Window {
    google: any;
  }
}

// Define a custom hook for loading the Google Maps API
const useGoogleMapsAPI = (initializeAutocomplete) => {
  useEffect(() => {
    const loadGoogleMapsAPI = async () => {
      if (typeof window === "undefined") return;

      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      script.onerror = () => console.error("Error loading Google Maps API");
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    //console.log("Attempting to load Google Maps API...");
    loadGoogleMapsAPI();
  }, [initializeAutocomplete]);
};

export default function PlacesAutocomplete({
  value,
  onChange,
  onKeyPress,
  className,
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState(value || "");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const autocompleteRef = useRef<any>(null);

  // Initialize autocomplete
  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const autocompleteInstance = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "QA" },
      }
    );
    autocompleteRef.current = autocompleteInstance;

    autocompleteInstance.addListener("place_changed", () => {
      const place = autocompleteInstance.getPlace();
      if (place.formatted_address) {
        setSearchInput(place.formatted_address);
        onChange(place.formatted_address);
        setIsPlaceSelected(true);
        //console.log("Place selected:", place.formatted_address);
      }
    });
  }, [onChange]);

  // Use custom hook to load Google Maps API
  useGoogleMapsAPI(initializeAutocomplete);

  useEffect(() => {
    if (value !== searchInput) {
      setSearchInput(value);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
    onChange(newValue);

    if (isPlaceSelected) {
      setIsPlaceSelected(false);
    }
  };

  const clearInput = () => {
    setSearchInput("");
    onChange("");
    setIsPlaceSelected(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter location in Qatar"
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={onKeyPress}
          className={cn("ps-10", className)}
          // disabled={isLoading}
          aria-label="Location input"
        />

        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          <Search size={16} />
        </div>

        {searchInput && (
          <button
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            type="button"
            aria-label="Clear input"
          >
            <X size={16} />
          </button>
        )}

        {/* {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )} */}
      </div>

      {/* We don't need to render our own dropdown as Google will inject its own */}
      {/* The CSS hack in initializeAutocomplete will ensure it's visible */}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-1 text-xs text-gray-400 hidden">
          API Loaded: {!isLoading ? "Yes" : "No"} | Input Value: {searchInput} |
          Selected: {isPlaceSelected ? "Yes" : "No"}
        </div>
      )}
    </div>
  );
}
