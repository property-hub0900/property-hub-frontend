"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchTabs from "@/components/search/search-tabs";

import PlacesAutocomplete from "@/components/placesAutoComplete";
import { useTranslations } from "next-intl";
import { PROPERTY_PURPOSE, PROPERTY_TYPES } from "@/constants/constants";
import { PUBLIC_ROUTES } from "@/constants/paths";

export default function HeroSection() {
  const t = useTranslations();

  const router = useRouter();
  const searchQueryRef = useRef("");

  // Simplified state with only the essential parameters
  const [searchParams, setSearchParams] = useState({
    propertyType: "",
    searchQuery: "", // This will store the selected location from Google Places API
    purpose: `${PROPERTY_PURPOSE[1]}`,
  });

  const handleSearch = () => {
    // When search button is clicked, this function builds the URL parameters
    const params = new URLSearchParams();

    // Use the ref value to ensure we have the latest searchQuery
    const currentSearchQuery =
      searchQueryRef.current || searchParams.searchQuery;

    // Add the selected location from Google Places to the searchQuery parameter
    if (currentSearchQuery) {
      params.set("address", currentSearchQuery);
    }

    if (searchParams.propertyType && searchParams.propertyType !== "") {
      params.set("propertyType", searchParams.propertyType);
    }

    params.set("purpose", searchParams.purpose);

    // Navigate to the properties page with the search parameters
    router.push(`${PUBLIC_ROUTES.properties}?${params.toString()}`);
  };

  // Update the handleTabChange function to map to the API's 'purpose' parameter
  const handleTabChange = (tab: string) => {
    setSearchParams((prev) => ({ ...prev, purpose: tab }));
  };

  return (
    <section className="relative w-full">
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url(/cover.png)",
        }}
      ></div>

      <div className="container mx-auto relative z-10 px-5 lg:px-0 py-16 lg:py-28">
        <div className="flex flex-col w-full lg:w-2/3">
          <div className="text-white space-y-5 mb-8 w-full lg:w-2/3">
            <h1 className="text-white">{t("title.landingHeroTitle")}</h1>
            <p className="text-lg">{t("title.landingHeroSubTitle")}</p>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-4xl rounded-md overflow-hidden shadow-lg">
            <SearchTabs onTabChange={handleTabChange} />
            <SearchForm
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearch={handleSearch}
              searchQueryRef={searchQueryRef}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Simplified SearchFormProps type
type SearchFormProps = {
  searchParams: {
    propertyType: string;
    searchQuery: string;
    purpose: string;
  };
  setSearchParams: React.Dispatch<
    React.SetStateAction<{
      propertyType: string;
      searchQuery: string;
      purpose: string;
    }>
  >;
  onSearch: () => void;
  searchQueryRef: React.RefObject<string>;
};

function SearchForm({
  searchParams,
  setSearchParams,
  onSearch,
  searchQueryRef,
}: SearchFormProps) {
  const t = useTranslations();

  const handlePropertyTypeChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, propertyType: value }));
  };

  const handleLocationChange = (value: string) => {
    // When a location is selected from Google Places API, this function is called
    // Update both the state and the ref to ensure we have the latest value
    searchQueryRef.current = value;

    setSearchParams((prev) => ({
      ...prev,
      searchQuery: value,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col bg-card sm:flex-row items-center p-4 rounded-sm rounded-tl-none">
      <div className="w-full sm:w-1/4 mb-3 sm:mb-0 sm:mr-3">
        <Select
          value={searchParams.propertyType}
          onValueChange={handlePropertyTypeChange}
        >
          <SelectTrigger className="border-0 shadow-none !outline-none focus:outline-none focus:ring-0 ">
            <SelectValue placeholder={t("form.propertyType.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.Commercial.map((item, index) => (
              <SelectItem key={index} value={item}>
                {t(`form.propertyType.options.${item}`)}
              </SelectItem>
            ))}
            {PROPERTY_TYPES.Residential.map((item, index) => (
              <SelectItem key={index} value={item}>
                {t(`form.propertyType.options.${item}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full mb-3 sm:mb-0 sm:mr-3 relative">
        <PlacesAutocomplete
          value={searchParams.searchQuery}
          onChange={handleLocationChange}
          onKeyPress={handleKeyPress}
          className="outline-none shadow-none border-0 focus:border-0 focus:ring-0 focus:outline-none focus-visible:outline-none"
        />
      </div>
      <Button className="w-28" onClick={onSearch}>
        {t("button.search")}
      </Button>
    </div>
  );
}
