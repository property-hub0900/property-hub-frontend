"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  PROPERTY_FURNISHED_TYPE,
  PROPERTY_PURPOSE,
  PROPERTY_TYPES,
} from "@/constants/constants";
import { amenities } from "@/services/dashboard/properties";
import { useQuery } from "@tanstack/react-query";
import PlacesAutocomplete from "@/components/placesAutoComplete";

interface Filters {
  address: string;
  searchQuery: string;
  purpose: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  priceMin: string;
  priceMax: string;
  furnishedType: string[];
  propertySizeMin: string;
  propertySizeMax: string;
  amenitiesIds: string[];
  page: string;
  pageSize: string;
  sortBy: string;
}

const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4", "5", "6", "7", "7+"];
const BATHROOM_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "7+"];
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price (Low to High)", value: "price_low" },
  { label: "Price (High to Low)", value: "price_high" },
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  const { data: amenitiesData } = useQuery({
    queryKey: ["amenities"],
    queryFn: amenities,
  });

  const initialFilters: Filters = {
    address: searchParams.get("address") || "",
    searchQuery: searchParams.get("searchQuery") || "",
    purpose: searchParams.get("purpose") || "",
    propertyType: searchParams.get("propertyType") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    furnishedType: searchParams.get("furnishedType")?.split(",") || [],
    propertySizeMin: searchParams.get("propertySizeMin") || "",
    propertySizeMax: searchParams.get("propertySizeMax") || "",
    amenitiesIds: searchParams.get("amenitiesIds")?.split(",") || [],
    page: searchParams.get("page") || "0",
    pageSize: searchParams.get("pageSize") || "10",
    sortBy: searchParams.get("sortBy") || "featured",
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [searchParams]);

  const updateURL = useCallback(
    (filters: Filters) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value &&
          (typeof value === "string" ? value.trim() : value.length > 0)
        ) {
          if (Array.isArray(value)) {
            params.set(key, value.join(","));
          } else {
            params.set(key, value);
          }
        }
      });
      router.push(`?${params.toString()}`);
    },
    [router]
  );

  const handleSelectChange = useCallback(
    (name: keyof Filters, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: value };
        if (name === "sortBy") {
          // Use setTimeout to avoid state updates during render
          setTimeout(() => {
            updateURL(newFilters);
          }, 0);
        }
        return newFilters;
      });
    },
    [updateURL]
  );

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      updateURL(filters);
      setIsMoreFiltersOpen(false);
    },
    [filters, updateURL]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof Filters, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[name] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      address: "",
      searchQuery: "",
      purpose: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      furnishedType: [],
      propertySizeMin: "",
      propertySizeMax: "",
      amenitiesIds: [],
      page: "0",
      pageSize: "10",
      sortBy: "featured",
    });
    router.push("?");
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Location Search */}
        <div className="relative flex-1">
          <PlacesAutocomplete
            value={filters.address}
            onChange={(value) => handleSelectChange("address", value)}
          />
        </div>

        {/* Purpose Select */}
        <Select
          value={filters.purpose}
          onValueChange={(value) => handleSelectChange("purpose", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Purpose" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_PURPOSE.map((purpose) => (
              <SelectItem key={purpose} value={purpose.toLowerCase()}>
                {purpose}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Property Type Select */}
        <Select
          value={filters.propertyType}
          onValueChange={(value) => handleSelectChange("propertyType", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            {[...PROPERTY_TYPES.Residential, ...PROPERTY_TYPES.Commercial].map(
              (type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {/* Beds & Baths Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px]">
              {filters.bedrooms || filters.bathrooms
                ? `${filters.bedrooms || "0"} Bed, ${
                    filters.bathrooms || "0"
                  } Bath`
                : "Beds & Baths"}{" "}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Bedrooms</h4>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((bed) => (
                    <Button
                      key={bed}
                      size="sm"
                      variant={filters.bedrooms === bed ? "default" : "outline"}
                      onClick={() => handleSelectChange("bedrooms", bed)}
                      className="flex-1"
                    >
                      {bed}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Bathrooms</h4>
                <div className="flex flex-wrap gap-2">
                  {BATHROOM_OPTIONS.map((bath) => (
                    <Button
                      key={bath}
                      size="sm"
                      variant={
                        filters.bathrooms === bath ? "default" : "outline"
                      }
                      onClick={() => handleSelectChange("bathrooms", bath)}
                      className="flex-1"
                    >
                      {bath}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Price Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px]">
              {filters.priceMin || filters.priceMax
                ? `${filters.priceMin || "0"} - ${filters.priceMax || "Any"}`
                : "Price"}{" "}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Price Range (QAR)</h4>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    name="priceMin"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="number"
                    name="priceMax"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* More Filters Dialog */}
        <Dialog open={isMoreFiltersOpen} onOpenChange={setIsMoreFiltersOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              More Filters <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>More Filters</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4">
              {/* Furnishing */}
              <div className="space-y-2">
                <h4 className="font-medium">Furnishing</h4>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_FURNISHED_TYPE.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`furnishing-${type}`}
                        checked={filters.furnishedType.includes(
                          type.toLowerCase()
                        )}
                        onCheckedChange={() =>
                          handleCheckboxChange(
                            "furnishedType",
                            type.toLowerCase()
                          )
                        }
                      />
                      <label
                        htmlFor={`furnishing-${type}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Size */}
              <div className="space-y-2">
                <h4 className="font-medium">Property Size (Sqm)</h4>
                <div className="flex gap-4">
                  <Input
                    type="number"
                    name="propertySizeMin"
                    placeholder="Min Area"
                    value={filters.propertySizeMin}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="number"
                    name="propertySizeMax"
                    placeholder="Max Area"
                    value={filters.propertySizeMax}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <h4 className="font-medium">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesData?.results.map((amenity) => (
                    <div
                      key={amenity.amenityId}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`amenity-${amenity.amenityId}`}
                        checked={filters.amenitiesIds.includes(
                          String(amenity.amenityId)
                        )}
                        onCheckedChange={() =>
                          handleCheckboxChange(
                            "amenitiesIds",
                            String(amenity.amenityId)
                          )
                        }
                      />
                      <label
                        htmlFor={`amenity-${amenity.amenityId}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Query */}
              <div className="space-y-2">
                <h4 className="font-medium">Keyword Search</h4>
                <Input
                  type="text"
                  name="searchQuery"
                  placeholder="Search by keyword"
                  value={filters.searchQuery}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-between p-4 border-t">
              <Button variant="outline" onClick={clearAllFilters}>
                Reset
              </Button>
              <Button onClick={() => handleSearch()}>Show Results</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-4 ml-auto">
          {/* Sort By Select */}
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleSelectChange("sortBy", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Find Button */}
          <Button type="submit">Find</Button>
        </div>
      </div>
    </form>
  );
}
