"use client"

import type React from "react"

import { useCallback, useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { BookmarkPlus, ChevronDown, Search, X } from "lucide-react"

import { FOR_RENT, FOR_SALE } from "@/constants"
import { useAuth } from "@/lib/hooks/useAuth"

// Property types available in the system
const PROPERTY_TYPES = ["Villa", "Apartment", "Office", "Townhouse"]

// Amenities available in the system
const AMENITIES = [
  { id: "1", label: "Maid's Room" },
  { id: "2", label: "Central AC" },
  { id: "3", label: "Private Gym" },
  { id: "4", label: "Walk-in Closet" },
  { id: "5", label: "View of Landmark" },
  { id: "6", label: "Balcony" },
  { id: "7", label: "Private Garden" },
  { id: "8", label: "Private Jacuzzi" },
  { id: "9", label: "Built In Kitchen Appliances" },
  { id: "10", label: "Pets Allowed" },
  { id: "11", label: "Study" },
  { id: "12", label: "Private Pool" },
  { id: "13", label: "Built In Wardrobes" },
  { id: "14", label: "View of Water" },
]

// Furnishing options
const FURNISHING_OPTIONS = [
  { id: "all", label: "All furnishings" },
  { id: "furnished", label: "Furnished" },
  { id: "unfurnished", label: "Unfurnished" },
  { id: "partly", label: "Partly Furnished" },
]

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Initialize state from URL query parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("searchQuery") || "")
  const [purpose, setPurpose] = useState(searchParams.get("purpose") || "")
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "")
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "")
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "")
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "")
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "")
  const [amenitiesIds, setAmenitiesIds] = useState<string[]>(searchParams.get("amenitiesIds")?.split(",") || [])
  const [furnishing, setFurnishing] = useState(searchParams.get("furnishing") || "all")
  const [minArea, setMinArea] = useState(searchParams.get("minArea") || "")
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") || "")
  const [keywords, setKeywords] = useState(searchParams.get("keywords") || "")

  // Track current and pending filter states
  const [pendingFilters, setPendingFilters] = useState({
    searchQuery,
    purpose,
    propertyType,
    bedrooms,
    bathrooms,
    priceMin,
    priceMax,
    amenitiesIds,
    furnishing,
    minArea,
    maxArea,
    keywords,
  })

  // More filters dialog state
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)

  // Track if search was performed
  const [searchPerformed, setSearchPerformed] = useState(false)

  // Active filters count for the badge
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Total active filters count
  const [totalActiveFilters, setTotalActiveFilters] = useState(0)

  // Check if there are any active filters for the Find button
  const hasActiveFilters =
    searchQuery ||
    purpose ||
    propertyType ||
    bedrooms ||
    bathrooms ||
    priceMin ||
    priceMax ||
    amenitiesIds.length > 0 ||
    furnishing !== "all" ||
    minArea ||
    maxArea ||
    keywords

  // Update active filters count
  useEffect(() => {
    let count = 0
    if (amenitiesIds.length > 0) count++
    if (furnishing !== "all") count++
    if (minArea || maxArea) count++
    if (keywords) count++
    setActiveFiltersCount(count)

    // Calculate total active filters
    let total = count
    if (searchQuery) total++
    if (purpose) total++
    if (propertyType) total++
    if (bedrooms) total++
    if (bathrooms) total++
    if (priceMin || priceMax) total++

    setTotalActiveFilters(total)
  }, [
    amenitiesIds,
    furnishing,
    minArea,
    maxArea,
    keywords,
    searchQuery,
    purpose,
    propertyType,
    bedrooms,
    bathrooms,
    priceMin,
    priceMax,
  ])

  // Handle purpose (rent/buy) change
  const handlePurposeChange = (value: string) => {
    setPurpose(value)
  }

  // Handle property type change
  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value)
  }

  // Handle bedrooms change
  const handleBedroomsChange = (value: string) => {
    setBedrooms(value)
  }

  // Handle bathrooms change
  const handleBathroomsChange = (value: string) => {
    setBathrooms(value)
  }

  // Handle price range change
  const handlePriceChange = (min: string, max: string) => {
    setPriceMin(min)
    setPriceMax(max)
  }

  // Handle amenity toggle
  const handleAmenityToggle = (amenityId: string) => {
    setAmenitiesIds((prev) => (prev.includes(amenityId) ? prev.filter((id) => id !== amenityId) : [...prev, amenityId]))
  }

  // Handle furnishing option change
  const handleFurnishingChange = (value: string) => {
    setFurnishing(value)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setPurpose("")
    setPropertyType("")
    setBedrooms("")
    setBathrooms("")
    setPriceMin("")
    setPriceMax("")
    setAmenitiesIds([])
    setFurnishing("all")
    setMinArea("")
    setMaxArea("")
    setKeywords("")

    // Update URL after clearing filters
    updateQueryParams({
      searchQuery: "",
      purpose: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
      amenitiesIds: [],
      furnishing: "all",
      minArea: "",
      maxArea: "",
      keywords: "",
    })

    // Focus search input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Remove a specific filter
  const removeFilter = (filterType: string) => {
    const updatedFilters = { ...pendingFilters }

    switch (filterType) {
      case "searchQuery":
        setSearchQuery("")
        updatedFilters.searchQuery = ""
        break
      case "purpose":
        setPurpose("")
        updatedFilters.purpose = ""
        break
      case "propertyType":
        setPropertyType("")
        updatedFilters.propertyType = ""
        break
      case "bedrooms":
        setBedrooms("")
        updatedFilters.bedrooms = ""
        break
      case "bathrooms":
        setBathrooms("")
        updatedFilters.bathrooms = ""
        break
      case "price":
        setPriceMin("")
        setPriceMax("")
        updatedFilters.priceMin = ""
        updatedFilters.priceMax = ""
        break
      case "amenities":
        setAmenitiesIds([])
        updatedFilters.amenitiesIds = []
        break
      case "furnishing":
        setFurnishing("all")
        updatedFilters.furnishing = "all"
        break
      case "area":
        setMinArea("")
        setMaxArea("")
        updatedFilters.minArea = ""
        updatedFilters.maxArea = ""
        break
      case "keywords":
        setKeywords("")
        updatedFilters.keywords = ""
        break
      default:
        break
    }

    // Update URL after removing filter
    updateQueryParams(updatedFilters)
  }

  // Save search function
  const saveSearch = () => {
    const filters = {
      searchQuery,
      purpose,
      propertyType,
      bedrooms,
      bathrooms,
      priceMin,
      priceMax,
      amenitiesIds,
      furnishing,
      minArea,
      maxArea,
      keywords,
    }
    console.log("Saved search filters:", filters)
    // Here you would typically save this to user's profile or localStorage
  }

  // Create a function to update URL with search parameters
  const updateQueryParams = useCallback(
    (filters: any = null) => {
      const params = new URLSearchParams()

      // Use provided filters or current state
      const currentFilters = filters || {
        searchQuery,
        purpose,
        propertyType,
        bedrooms,
        bathrooms,
        priceMin,
        priceMax,
        amenitiesIds,
        furnishing,
        minArea,
        maxArea,
        keywords,
      }

      if (currentFilters.searchQuery) params.set("searchQuery", currentFilters.searchQuery)
      if (currentFilters.purpose) params.set("purpose", currentFilters.purpose)
      if (currentFilters.propertyType) params.set("propertyType", currentFilters.propertyType)
      if (currentFilters.bedrooms) params.set("bedrooms", currentFilters.bedrooms)
      if (currentFilters.bathrooms) params.set("bathrooms", currentFilters.bathrooms)
      if (currentFilters.priceMin) params.set("priceMin", currentFilters.priceMin)
      if (currentFilters.priceMax) params.set("priceMax", currentFilters.priceMax)
      if (currentFilters.amenitiesIds.length > 0) params.set("amenitiesIds", currentFilters.amenitiesIds.join(","))
      if (currentFilters.furnishing && currentFilters.furnishing !== "all")
        params.set("furnishing", currentFilters.furnishing)
      if (currentFilters.minArea) params.set("minArea", currentFilters.minArea)
      if (currentFilters.maxArea) params.set("maxArea", currentFilters.maxArea)
      if (currentFilters.keywords) params.set("keywords", currentFilters.keywords)

      // Use replace to avoid adding to browser history for every change
      router.push(`?${params.toString()}`)
      setSearchPerformed(true)

      // Update pending filters
      setPendingFilters(currentFilters)
    },
    [router],
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const currentFilters = {
      searchQuery,
      purpose,
      propertyType,
      bedrooms,
      bathrooms,
      priceMin,
      priceMax,
      amenitiesIds,
      furnishing,
      minArea,
      maxArea,
      keywords,
    }

    updateQueryParams(currentFilters)
    setMoreFiltersOpen(false)
  }

  // Handle search input change with debounce
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Apply more filters
  const applyMoreFilters = () => {
    const currentFilters = {
      searchQuery,
      purpose,
      propertyType,
      bedrooms,
      bathrooms,
      priceMin,
      priceMax,
      amenitiesIds,
      furnishing,
      minArea,
      maxArea,
      keywords,
    }

    updateQueryParams(currentFilters)
    setMoreFiltersOpen(false)
  }

  // Get display text for bedrooms and bathrooms filter
  const getBedsAndBathsDisplayText = () => {
    if (!bedrooms && !bathrooms) return "Beds & Bath"
    if (bedrooms && !bathrooms) return `${bedrooms}+ Beds`
    if (!bedrooms && bathrooms) return `${bathrooms}+ Baths`
    return `${bedrooms}+ Beds, ${bathrooms}+ Baths`
  }

  // Get display text for price filter
  const getPriceDisplayText = () => {
    if (!priceMin && !priceMax) return "Price"
    if (priceMin && !priceMax) return `${Number(priceMin).toLocaleString()}+ QAR`
    if (!priceMin && priceMax) return `Up to ${Number(priceMax).toLocaleString()} QAR`
    return `${Number(priceMin).toLocaleString()} - ${Number(priceMax).toLocaleString()} QAR`
  }

  // Get display text for property type filter
  const getPropertyTypeDisplayText = () => {
    if (!propertyType) return "Property Type"
    return propertyType
  }

  // Get display text for purpose filter
  const getPurposeDisplayText = () => {
    if (!purpose) return "Purpose"
    return purpose === FOR_SALE ? "Buy" : "Rent"
  }

  return (
    <div className="mb-6 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        {/* Search form layout - stacked on mobile, single row on large screens */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search input */}
          <div className="relative w-full lg:w-1/3 xl:w-2/5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search by location, community, or building"
              className="pl-9 h-11 border-slate-200 w-full"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => {
                  setSearchQuery("")
                  if (searchInputRef.current) {
                    searchInputRef.current.focus()
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter buttons - grid on mobile, flex row on large screens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:flex lg:flex-1 gap-2">
            {/* Purpose (Buy/Rent) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 border-slate-200 w-full lg:flex-1" type="button">
                  <span className="truncate">{getPurposeDisplayText()}</span>{" "}
                  <ChevronDown className="ml-1 h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuRadioGroup value={purpose} onValueChange={handlePurposeChange}>
                  <DropdownMenuRadioItem value={FOR_SALE}>Buy</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={FOR_RENT}>Rent</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Property Type */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 border-slate-200 w-full lg:flex-1" type="button">
                  <span className="truncate">{getPropertyTypeDisplayText()}</span>{" "}
                  <ChevronDown className="ml-1 h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuRadioGroup value={propertyType} onValueChange={handlePropertyTypeChange}>
                  <DropdownMenuRadioItem value="">Any Type</DropdownMenuRadioItem>
                  {PROPERTY_TYPES.map((type) => (
                    <DropdownMenuRadioItem key={type} value={type}>
                      {type}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Beds & Bath */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 border-slate-200 w-full lg:flex-1" type="button">
                  <span className="truncate">{getBedsAndBathsDisplayText()}</span>{" "}
                  <ChevronDown className="ml-1 h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[250px] p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Bedrooms</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={bedrooms === "" ? "default" : "outline"}
                        onClick={() => handleBedroomsChange("")}
                      >
                        Any
                      </Button>
                      {["1", "2", "3", "4", "5"].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          size="sm"
                          variant={bedrooms === value ? "default" : "outline"}
                          onClick={() => handleBedroomsChange(value)}
                        >
                          {value}+
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Bathrooms</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={bathrooms === "" ? "default" : "outline"}
                        onClick={() => handleBathroomsChange("")}
                      >
                        Any
                      </Button>
                      {["1", "2", "3", "4", "5"].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          size="sm"
                          variant={bathrooms === value ? "default" : "outline"}
                          onClick={() => handleBathroomsChange(value)}
                        >
                          {value}+
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Price */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 border-slate-200 w-full lg:flex-1" type="button">
                  <span className="truncate">{getPriceDisplayText()}</span>{" "}
                  <ChevronDown className="ml-1 h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px] p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Price Range (QAR)</h4>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Filters */}
            <Button
              variant="outline"
              className="h-11 border-slate-200 relative w-full lg:flex-1"
              type="button"
              onClick={() => setMoreFiltersOpen(true)}
            >
              <span className="truncate">More Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full shrink-0">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className="ml-1 h-4 w-4 shrink-0" />
            </Button>

            {/* Find Button */}
            <Button
              type="submit"
              className="h-11 bg-primary w-full lg:flex-1"
              disabled={!hasActiveFilters}
            >
              Find
            </Button>
          </div>
        </div>
      </form>

      {/* Save Search Link */}
      {user?.role !== "staff" && <div className="flex justify-end mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-sm flex items-center gap-1 text-blue-500 hover:text-blue-600"
          onClick={saveSearch}
          disabled={!hasActiveFilters}
        >
          <BookmarkPlus className="h-4 w-4" />
          Save Search
        </Button>
      </div>
      }
      {/* Active filters display */}
      {totalActiveFilters > 0 && (
        <div className="mt-3">
          <Separator className="mb-3" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Filters:</span>
              <Button variant="outline" size="sm" className="text-xs h-7 whitespace-nowrap" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="outline" className="flex items-center gap-1 max-w-full bg-background">
                  <span className="truncate max-w-[150px] sm:max-w-[200px]">Search: {searchQuery}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("searchQuery")}
                    aria-label="Remove search filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {purpose && (
                <Badge variant="outline" className="flex items-center gap-1 bg-background">
                  <span className="truncate">Purpose: {purpose === FOR_SALE ? "Buy" : "Rent"}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("purpose")}
                    aria-label="Remove purpose filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {propertyType && (
                <Badge variant="outline" className="flex items-center gap-1 bg-background">
                  <span className="truncate">Type: {propertyType}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("propertyType")}
                    aria-label="Remove property type filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {bedrooms && (
                <Badge variant="outline" className="flex items-center gap-1 bg-background">
                  <span className="truncate">{bedrooms}+ Beds</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("bedrooms")}
                    aria-label="Remove bedrooms filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {bathrooms && (
                <Badge variant="outline" className="flex items-center gap-1 bg-background">
                  <span className="truncate">{bathrooms}+ Baths</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("bathrooms")}
                    aria-label="Remove bathrooms filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {(priceMin || priceMax) && (
                <Badge variant="outline" className="flex items-center gap-1 bg-background">
                  <span className="truncate">
                    Price: {priceMin ? `${Number(priceMin).toLocaleString()}` : "0"}
                    {priceMax ? ` - ${Number(priceMax).toLocaleString()}` : "+"} QAR
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("price")}
                    aria-label="Remove price filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {amenitiesIds.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1 bg-background">
                  <span className="truncate">{amenitiesIds.length} Amenities</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("amenities")}
                    aria-label="Remove amenities filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {furnishing !== "all" && (
                <Badge variant="outline" className="flex items-center gap-1 bg-background">
                  <span className="truncate">
                    {furnishing === "furnished"
                      ? "Furnished"
                      : furnishing === "unfurnished"
                        ? "Unfurnished"
                        : "Partly Furnished"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("furnishing")}
                    aria-label="Remove furnishing filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {(minArea || maxArea) && (
                <Badge variant="outline" className="flex items-center gap-1 bg-background">
                  <span className="truncate">
                    Area: {minArea || "0"} - {maxArea || "+"} sqm
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("area")}
                    aria-label="Remove area filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {keywords && (
                <Badge variant="outline" className="flex items-center gap-1 max-w-full bg-background">
                  <span className="truncate max-w-[150px] sm:max-w-[200px]">Keywords: {keywords}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 shrink-0"
                    onClick={() => removeFilter("keywords")}
                    aria-label="Remove keywords filter"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* More Filters Dialog */}
      <Dialog open={moreFiltersOpen} onOpenChange={setMoreFiltersOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">More Filters</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Furnishing */}
            <div className="space-y-3">
              <h3 className="font-medium text-base">Furnishing</h3>
              <div className="flex flex-wrap gap-2">
                {FURNISHING_OPTIONS.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    variant={furnishing === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFurnishingChange(option.id)}
                    className="text-sm"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Property Size */}
            <div className="space-y-3">
              <h3 className="font-medium text-base">Property Size (Sqm)</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min. Area"
                  value={minArea}
                  onChange={(e) => setMinArea(e.target.value)}
                  className="w-full"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max. Area"
                  value={maxArea}
                  onChange={(e) => setMaxArea(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-base">Amenities</h3>
                {amenitiesIds.length > 0 && (
                  <Button variant="link" size="sm" className="text-xs p-0 h-auto" onClick={() => setAmenitiesIds([])}>
                    Clear All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AMENITIES.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity.id}`}
                      checked={amenitiesIds.includes(amenity.id)}
                      onCheckedChange={() => handleAmenityToggle(amenity.id)}
                    />
                    <Label htmlFor={`amenity-${amenity.id}`} className="text-sm cursor-pointer">
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <h3 className="font-medium text-base">Keywords</h3>
              <Input
                placeholder="Keywords, e.g beach, corner flat"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate multiple keywords with commas</p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setAmenitiesIds([])
                setFurnishing("all")
                setMinArea("")
                setMaxArea("")
                setKeywords("")
              }}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Reset Filters
            </Button>

            <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
              <DialogClose asChild>
                <Button variant="outline" type="button" className="flex-1 sm:flex-auto">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={applyMoreFilters} className="flex-1 sm:flex-auto">
                Apply Filters
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

