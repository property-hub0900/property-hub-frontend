/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { X, Loader2 } from "lucide-react";

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

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = async () => {
      if (typeof window === "undefined") return;

      // If Google Maps API is already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete();
        setIsLoading(false);
        return;
      }

      try {
        // Load Google Maps API script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeAutocomplete();
          setIsLoading(false);
        };
        script.onerror = () => {
          console.error("Error loading Google Maps API");
          setIsLoading(false);
        };
        document.head.appendChild(script);

        return () => {
          // Clean up script if component unmounts during loading
          document.head.removeChild(script);
        };
      } catch (error) {
        console.error("Error setting up Google Maps API:", error);
        setIsLoading(false);
      }
    };

    loadGoogleMapsAPI();
  }, []);

  // Initialize autocomplete when input ref is available and API is loaded
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    try {
      console.log("Initializing autocomplete");
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "QA" },
        }
      );
      autocompleteRef.current = autocompleteInstance;

      // Listen for place selection
      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();
        if (place.formatted_address) {
          setSearchInput(place.formatted_address);
          onChange(place.formatted_address);
          setIsPlaceSelected(true);
        }
      });

      // This is a hack to access predictions
      // Google doesn't officially expose this, but it works in most browsers
      const originalFunc = inputRef.current.addEventListener;
      inputRef.current.addEventListener = function (type, listener, options) {
        if (type === "keydown") {
          const originalListener = listener;
          listener = (e) => {
            // After a short delay, try to access predictions
            setTimeout(() => {
              try {
                // This is accessing a private property of the autocomplete instance
                // It's not ideal, but it's the only way to get predictions without using Places API directly
                const pacContainer = document.querySelector(".pac-container");
                if (pacContainer) {
                  // Make sure the pac-container is visible and positioned correctly
                  const inputRect = inputRef.current?.getBoundingClientRect();
                  if (inputRect) {
                    pacContainer.setAttribute(
                      "style",
                      `
                      display: block !important; 
                      position: absolute !important;
                      z-index: 1000 !important;
                      width: ${inputRect.width}px !important;
                      top: ${inputRect.bottom}px !important;
                      left: ${inputRect.left}px !important;
                    `
                    );
                  }

                  // Force the pac-container to be visible
                  const style = document.createElement("style");
                  style.textContent = `
                    .pac-container {
                      display: block !important;
                      z-index: 1000 !important;
                    }
                  `;
                  document.head.appendChild(style);

                  // Clean up style after a short delay
                  setTimeout(() => {
                    document.head.removeChild(style);
                  }, 100);
                }
              } catch (err) {
                console.error("Error accessing predictions:", err);
              }
            }, 100);

            // Call the original listener
            originalListener.call(this as any, e) as any;
          };
        }
        return originalFunc.call(this, type, listener, options);
      };
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }
  };

  useEffect(() => {
    // Sync the input value with the prop value
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
          className={`${className} ${isPlaceSelected ? "border-primary" : ""}`}
          disabled={isLoading}
        />

        {searchInput && (
          <button
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X size={16} />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}
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
