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
import { Bookmark, ChevronDown, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  PROPERTY_FURNISHED_TYPE,
  PROPERTY_PURPOSE,
  PROPERTY_TYPES,
} from "@/constants/constants";
import { amenities } from "@/services/protected/properties";
import { useQuery } from "@tanstack/react-query";
import PlacesAutocomplete from "@/components/placesAutoComplete";
import { IPropertyFilters } from "@/types/public/properties";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/useAuth";

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
  minArea: string;
  maxArea: string;
  amenitiesIds: string[];
  page: string;
  pageSize: string;
  sortBy: string;
}

const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "7+"];
const BATHROOM_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "7+"];
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price (Low to High)", value: "price_low" },
  { label: "Price (High to Low)", value: "price_high" },
];

export const PropertySearchFilters = () => {
  const { user } = useAuth();

  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  const { data: amenitiesData } = useQuery({
    queryKey: ["amenities"],
    queryFn: amenities,
  });

  const initialFilters: IPropertyFilters = {
    address: searchParams.get("address") || "",
    searchQuery: searchParams.get("searchQuery") || "",
    purpose: searchParams.get("purpose") || "",
    propertyType:
      searchParams.get("propertyType") || t("form.propertyType.label"),
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    furnishedType: searchParams.get("furnishedType")?.split(",") || [],
    minArea: searchParams.get("minArea") || "",
    maxArea: searchParams.get("maxArea") || "",
    amenitiesIds: searchParams.get("amenitiesIds")?.split(",") || [],
    page: searchParams.get("page") || "0",
    pageSize: searchParams.get("pageSize") || "10",
    sortBy: searchParams.get("sortBy") || "featured",
  };

  const [filters, setFilters] = useState<IPropertyFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [searchParams]);

  const updateURL = useCallback(
    (filters: IPropertyFilters) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value &&
          (typeof value === "string" ? value.trim() : value.length > 0) &&
          !(key === "propertyType" && value === t("form.propertyType.label"))
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
      minArea: "",
      maxArea: "",
      amenitiesIds: [],
      page: "0",
      pageSize: "10",
      sortBy: "featured",
    });
    router.push("?");
    setIsMoreFiltersOpen(false);
  };

  return (
    <form onSubmit={handleSearch} className="">
      <div className="flex flex-col grow md:flex-row gap-2 mb-6">
        {/* Location Search */}
        <div className="relative w-96 flex-1 ">
          <PlacesAutocomplete
            className="h-11"
            value={filters.address || ""}
            onChange={(value) => handleSelectChange("address", value)}
          />
        </div>

        {/* Purpose Select */}
        <Select
          value={filters.purpose}
          onValueChange={(value) => handleSelectChange("purpose", value)}
        >
          <SelectTrigger className="w-auto h-11">
            <SelectValue placeholder="Purpose" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_PURPOSE.map((purpose) => (
              <SelectItem key={purpose} value={purpose}>
                {purpose === "For Sale" ? t("button.buy") : t("button.rent")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Property Type Select */}
        <Select
          value={filters.propertyType}
          onValueChange={(value) => handleSelectChange("propertyType", value)}
        >
          <SelectTrigger className="w-auto h-11">
            <SelectValue placeholder={t("form.propertyType.label")} />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value={t("form.propertyType.label")}>
              {t("form.propertyType.label")}
            </SelectItem>
            {[...PROPERTY_TYPES.Residential, ...PROPERTY_TYPES.Commercial].map(
              (type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        {/* Beds & Baths Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {filters.bedrooms || filters.bathrooms
                ? `${filters.bedrooms} Bed, ${filters.bathrooms} Bath`
                : "Beds & Baths"}{" "}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-4s">
            <div className="space-y-4">
              <div className="space-y-2">
                <h6 className="">Bedrooms</h6>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((bed) => (
                    <Button
                      key={bed}
                      size="icon"
                      variant={filters.bedrooms === bed ? "default" : "outline"}
                      onClick={() => handleSelectChange("bedrooms", bed)}
                    >
                      {bed}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h6 className="font-medium">Bathrooms</h6>
                <div className="flex flex-wrap gap-2">
                  {BATHROOM_OPTIONS.map((bath) => (
                    <Button
                      key={bath}
                      size="icon"
                      variant={
                        filters.bathrooms === bath ? "default" : "outline"
                      }
                      onClick={() => handleSelectChange("bathrooms", bath)}
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
            <Button variant="outline">
              {filters.priceMin || filters.priceMax
                ? `${filters.priceMin || "0"} - ${filters.priceMax || "Any"}`
                : "Price"}{" "}
              <ChevronDown className="ms-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[380px] px-4 py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                {/* <h6 className="font-normal">Price Range (QAR)</h6> */}
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
              More Filters <ChevronDown className="ms-2 size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] px-0">
            <DialogHeader className="px-10">
              <DialogTitle>More Filters</DialogTitle>
            </DialogHeader>
            <Separator />
            <div className="overflow-y-auto h-[65vh] px-10">
              {/* Furnishing */}
              <div className="space-y-2">
                <h6>Furnishing</h6>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                  {PROPERTY_FURNISHED_TYPE.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`furnishing-${type}`}
                        checked={filters.furnishedType?.includes(type)}
                        onCheckedChange={() =>
                          handleCheckboxChange("furnishedType", type)
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
              <Separator className="mt-6 mb-4" />
              {/* Property Size */}
              <div className="space-y-2">
                <h6>Property Size (Sqf)</h6>
                <div className="flex gap-4">
                  <Input
                    type="number"
                    name="minArea"
                    placeholder="Min Area"
                    value={filters.minArea}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="number"
                    name="maxArea"
                    placeholder="Max Area"
                    value={filters.maxArea}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Separator className="mt-6 mb-4" />
              {/* Amenities */}
              <div className="space-y-2">
                <h6>Amenities</h6>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                  {amenitiesData?.results.map((amenity) => (
                    <div
                      key={amenity.amenityId}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`amenity-${amenity.amenityId}`}
                        checked={filters.amenitiesIds?.includes(
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
              <Separator className="mt-6 mb-4" />
              {/* Search Query */}
              <div className="space-y-2 mb-2">
                <h6>Keyword Search</h6>
                <Input
                  type="text"
                  name="searchQuery"
                  placeholder="Search by keyword"
                  value={filters.searchQuery}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-between px-10 pt-4 border-t">
              <Button variant="outline" onClick={clearAllFilters}>
                Reset
              </Button>
              <Button onClick={() => handleSearch()}>Show Results</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Find Button */}
        <Button type="submit">Find</Button>
      </div>
      <div className="flex justify-between mb-10">
        <div>
          {user?.role && user?.role !== "staff" && (
            <Button type="button" variant="outlinePrimary">
              <Bookmark className="size-5" />
              {t("button.save")} {t("button.search")}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Sort By: </label>
          {/* Sort By Select */}
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleSelectChange("sortBy", value)}
          >
            <SelectTrigger className="w-[120px] h-11">
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
        </div>
      </div>
    </form>
  );
};
