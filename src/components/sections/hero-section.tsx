"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SearchTabs from "@/components/search/search-tabs"
import { Container } from "@/components/ui/container"
import { Input } from "@/components/ui/input"
import { FOR_SALE } from "@/constants"
// import PlacesAutocomplete from "@/components/search/places-autocomplete"

type HeroSectionProps = {
  t: any
}

export default function HeroSection({ t }: HeroSectionProps) {
  const router = useRouter()

  // Update the searchParams state to include all API parameters
  const [searchParams, setSearchParams] = useState({
    propertyType: "all",
    searchQuery: "", // Changed from searchTerm to match API
    location: "", // Keep for UI purposes
    purpose: FOR_SALE, // Changed from listingType to match API
    bedrooms: undefined as number | undefined,
    bathrooms: undefined as number | undefined,
    priceMin: undefined as number | undefined,
    priceMax: undefined as number | undefined,
    // Additional API parameters
    amenitiesIds: undefined as string | undefined,
    companyId: undefined as number | undefined,
    page: 0,
    pageSize: 10,
  })

  const handleSearch = () => {

    const params = new URLSearchParams()

    if (searchParams.searchQuery) {
      params.set("searchQuery", searchParams.searchQuery)
    }

    if (searchParams.propertyType && searchParams.propertyType !== "all") {
      params.set("propertyType", searchParams.propertyType)
    }

    params.set("purpose", searchParams.purpose)
    router.push(`/en/properties?${params.toString()}`)
  }

  // Update the handleTabChange function to map to the API's 'purpose' parameter
  const handleTabChange = (tab: string) => {
    setSearchParams((prev) => ({ ...prev, purpose: tab }))
  }

  return (
    <section className="relative h-[500px] w-full">
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url(/cover.png)",
        }}
      ></div>

      <div className="relative z-20 flex items-center justify-center h-full w-full">
        <Container alignment="left" maxWidth="screen" className="ml-6">
          <div className="flex flex-col text-white">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">{t("hero.title")}</h1>
            <p className="text-white text-base max-w-xl mb-8 opacity-90">{t("hero.subtitle")}</p>

            {/* Search Box */}
            <div className="w-full max-w-4xl rounded-md overflow-hidden shadow-lg">
              <SearchTabs t={t} onTabChange={handleTabChange} />
              <SearchForm t={t} searchParams={searchParams} setSearchParams={setSearchParams as any} onSearch={handleSearch} />
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

// Update the SearchFormProps type to include all parameters
type SearchFormProps = {
  t: any
  searchParams: {
    propertyType: string
    searchQuery: string
    location: string
    purpose: string
    bedrooms?: number
    bathrooms?: number
    priceMin?: number
    priceMax?: number
    amenitiesIds?: string
    companyId?: number
    page: number
    pageSize: number
  }
  setSearchParams: React.Dispatch<
    React.SetStateAction<{
      propertyType: string
      searchQuery: string
      purpose: string
      bedrooms?: number
      bathrooms?: number
      priceMin?: number
      priceMax?: number
      amenitiesIds?: string
      companyId?: number
      page: number
      pageSize: number
    }>
  >
  onSearch: () => void
}

function SearchForm({ t, searchParams, setSearchParams, onSearch }: SearchFormProps) {
  const handlePropertyTypeChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, propertyType: value }))
  }

  const handleLocationChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, searchQuery: value }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <div className="flex flex-col bg-card sm:flex-row items-center p-4 rounded-sm rounded-tl-none">
      <div className="w-full sm:w-1/4 mb-3 sm:mb-0 sm:mr-3">
        <Select value={searchParams.propertyType} onValueChange={handlePropertyTypeChange}>
          <SelectTrigger className="w-full border border-input rounded-md h-10 text-primary font-bold">
            <SelectValue className="text-black" placeholder={t("search.propertyType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("search.allProperties")}</SelectItem>
            <SelectItem value="House">{t("search.house")}</SelectItem>
            <SelectItem value="Apartment">{t("search.apartment")}</SelectItem>
            <SelectItem value="Villa">{t("search.villa")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full mb-3 sm:mb-0 sm:mr-3 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10" size={18} />
        {/* <PlacesAutocomplete
          value={searchParams.location}
          onChange={handleLocationChange}
          onKeyPress={handleKeyPress}
        /> */}
        <Input
          type="text"
          placeholder="Enter location"
          value={searchParams.searchQuery}
          onChange={(e) => handleLocationChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="pl-10 text-primary"
        />
      </div>
      <Button
        className="w-full sm:w-1/6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-10"
        onClick={onSearch}
      >
        {t("search.button")}
      </Button>
    </div>
  )
}

