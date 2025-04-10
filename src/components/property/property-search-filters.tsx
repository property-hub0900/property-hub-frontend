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
import {
  Bookmark,
  ChevronDown,
  Filter,
  icons,
  Save,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  PROPERTY_FURNISHED_TYPE,
  PROPERTY_PURPOSE,
  PROPERTY_SORT_BY,
  PROPERTY_TYPES,
} from "@/constants/constants";
import { amenities } from "@/services/protected/properties";
import { useQuery } from "@tanstack/react-query";
import PlacesAutocomplete from "@/components/placesAutoComplete";
import { IPropertyFilters } from "@/types/public/properties";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/useAuth";

const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "7+"];
const BATHROOM_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "7+"];

export const PropertySearchFilters = () => {
  const { user } = useAuth();

  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  const sortOptions = Object.values(PROPERTY_SORT_BY).map((val) => ({
    label: t(`form.sortBy.options.${val}`),
    value: val,
  }));

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
    (name: keyof IPropertyFilters, value: string) => {
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

      setIsMoreFiltersOpen(false);
      setTimeout(() => {
        router.push(`?${params.toString()}`);
      }, 500);
    },
    [filters, router, t]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: keyof IPropertyFilters,
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = prev[name] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  console.log("isMoreFiltersOpen", isMoreFiltersOpen);

  const clearAllFilters = useCallback(() => {
    const newFilters = {
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
    };

    setFilters(newFilters);

    setIsMoreFiltersOpen(false);
    setTimeout(() => {
      router.push("?");
    }, 500);
  }, [router]);

  return (
    <form onSubmit={handleSearch} className="">
      <div className="flex  gap-2 mb-6">
        {/* Location Search - Always visible */}
        <div className="relative flex-1">
          <PlacesAutocomplete
            className="h-11"
            value={filters.address || ""}
            onChange={(value) => handleSelectChange("address", value)}
          />
        </div>

        {/* Desktop Filters - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2">
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
              {[
                ...PROPERTY_TYPES.Residential,
                ...PROPERTY_TYPES.Commercial,
              ].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Beds & Baths Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {filters.bedrooms || filters.bathrooms
                  ? `${filters.bedrooms} ${t("button.bed")}, ${
                      filters.bathrooms
                    } ${t("button.bath")}`
                  : `${t("button.bedsAndBaths")}`}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-4s">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h6 className="">{t("form.bedrooms.label")}</h6>
                  <div className="flex flex-wrap gap-2">
                    {BEDROOM_OPTIONS.map((bed) => (
                      <Button
                        key={bed}
                        size="icon"
                        variant={
                          filters.bedrooms === bed ? "default" : "outline"
                        }
                        onClick={() => handleSelectChange("bedrooms", bed)}
                      >
                        {bed}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h6 className="font-medium">{t("form.bathrooms.label")}</h6>
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
                  ? `${filters.priceMin || "0"} - ${
                      filters.priceMax || `${t("text.any")}`
                    }`
                  : `${t("form.price.label")}`}{" "}
                <ChevronDown className="ms-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] px-4 py-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      name="priceMin"
                      placeholder={`${t("text.min")}`}
                      value={filters.priceMin}
                      onChange={handleInputChange}
                    />
                    <Input
                      type="number"
                      name="priceMax"
                      placeholder={`${t("text.max")}`}
                      value={filters.priceMax}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Mobile More Filters Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-11"
            onClick={() => setIsMoreFiltersOpen(true)}
          >
            <SlidersHorizontal className="size-5" />
          </Button>
        </div>

        {/* Desktop More Filters Button */}
        <Button
          type="button"
          variant="outline"
          className="hidden lg:flex"
          onClick={() => setIsMoreFiltersOpen(true)}
        >
          {t("button.moreFilters")}
          <ChevronDown className="ms-2 size-4" />
        </Button>

        {/* Find Button */}
        <Button type="submit" className="w-10 lg:w-auto">
          {t("button.find")}
        </Button>
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
          <label className="hidden lg:flex text-sm text-muted-foreground">
            {t("form.sortBy.label")}:
          </label>
          {/* Sort By Select */}
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleSelectChange("sortBy", value)}
          >
            <SelectTrigger className="w-[120px] h-11">
              <SelectValue placeholder={t("form.sortBy.label")} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* More Filters Dialog */}
      <Dialog open={isMoreFiltersOpen} onOpenChange={setIsMoreFiltersOpen}>
        <DialogContent className="sm:max-w-[800px] px-0">
          <DialogHeader className="px-10">
            <DialogTitle>{t("button.moreFilters")}</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="overflow-y-auto h-[65vh] px-10">
            {/* Mobile Only Filters */}
            <div className="lg:hidden space-y-6">
              {/* Purpose Select */}
              <div className="space-y-2">
                <h6>{t("form.propertyPurpose.label")}</h6>
                <Select
                  value={filters.purpose}
                  onValueChange={(value) =>
                    handleSelectChange("purpose", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_PURPOSE.map((purpose) => (
                      <SelectItem key={purpose} value={purpose}>
                        {purpose === "For Sale"
                          ? t("button.buy")
                          : t("button.rent")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type Select */}
              <div className="space-y-2">
                <h6>{t("form.propertyType.label")}</h6>
                <Select
                  value={filters.propertyType}
                  onValueChange={(value) =>
                    handleSelectChange("propertyType", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("form.propertyType.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t("form.propertyType.label")}>
                      {t("form.propertyType.label")}
                    </SelectItem>
                    {[
                      ...PROPERTY_TYPES.Residential,
                      ...PROPERTY_TYPES.Commercial,
                    ].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <h6>{t("form.price.label")}</h6>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    name="priceMin"
                    placeholder={`${t("text.min")}`}
                    value={filters.priceMin}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="number"
                    name="priceMax"
                    placeholder={`${t("text.max")}`}
                    value={filters.priceMax}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Beds & Baths */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h6>{t("form.bedrooms.label")}</h6>
                  <div className="flex flex-wrap gap-2">
                    {BEDROOM_OPTIONS.map((bed) => (
                      <Button
                        key={bed}
                        size="icon"
                        variant={
                          filters.bedrooms === bed ? "default" : "outline"
                        }
                        onClick={() => handleSelectChange("bedrooms", bed)}
                      >
                        {bed}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h6>{t("form.bathrooms.label")}</h6>
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
              <Separator />
            </div>

            {/* Furnishing */}
            <div className="space-y-2">
              <h6>{t("title.furnishing")}</h6>
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
                      {t(`form.furnishedType.options.${type}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="mt-6 mb-4" />
            {/* Property Size */}
            <div className="space-y-2">
              <h6>
                {t("form.propertySize.label")} ({t("text.sqft")})
              </h6>
              <div className="flex gap-4">
                <Input
                  type="number"
                  name="minArea"
                  placeholder={t("text.minArea")}
                  value={filters.minArea}
                  onChange={handleInputChange}
                />
                <Input
                  type="number"
                  name="maxArea"
                  placeholder={t("text.maxArea")}
                  value={filters.maxArea}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Separator className="mt-6 mb-4" />
            {/* Amenities */}
            <div className="space-y-2">
              <h6>{t("title.amenities")}</h6>
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
              <h6>{t("title.keywordSearch")}</h6>
              <Input
                type="text"
                name="searchQuery"
                placeholder={t("title.keywordSearch")}
                value={filters.searchQuery}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-between px-10 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                clearAllFilters();
              }}
            >
              {t("button.reset")}
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              {t("button.showResults")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};
