"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SearchTabs from "@/components/search/search-tabs"
import { Container } from "@/components/ui/container"
import { FOR_SALE } from "@/constants"
import PlacesAutocomplete from "@/components/placesAutoComplete"

type HeroSectionProps = {
  t: any
}

export default function HeroSection({ t }: HeroSectionProps) {
  const router = useRouter()
  const searchQueryRef = useRef("")

  // Simplified state with only the essential parameters
  const [searchParams, setSearchParams] = useState({
    propertyType: "all",
    searchQuery: "", // This will store the selected location from Google Places API
    purpose: FOR_SALE,
  })

  const handleSearch = () => {
    // When search button is clicked, this function builds the URL parameters
    const params = new URLSearchParams()

    // Use the ref value to ensure we have the latest searchQuery
    const currentSearchQuery = searchQueryRef.current || searchParams.searchQuery

    // Add the selected location from Google Places to the searchQuery parameter
    if (currentSearchQuery) {
      params.set("searchQuery", currentSearchQuery)
      console.log("Search query:", currentSearchQuery) // Debug log
    }

    if (searchParams.propertyType && searchParams.propertyType !== "all") {
      params.set("propertyType", searchParams.propertyType)
    }

    params.set("purpose", searchParams.purpose)

    // Navigate to the properties page with the search parameters
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
              <SearchForm
                t={t}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                onSearch={handleSearch}
                searchQueryRef={searchQueryRef}
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

// Simplified SearchFormProps type
type SearchFormProps = {
  t: any
  searchParams: {
    propertyType: string
    searchQuery: string
    purpose: string
  }
  setSearchParams: React.Dispatch<
    React.SetStateAction<{
      propertyType: string
      searchQuery: string
      purpose: string
    }>
  >
  onSearch: () => void
  searchQueryRef: React.RefObject<string>
}

function SearchForm({ t, searchParams, setSearchParams, onSearch, searchQueryRef }: SearchFormProps) {
  const handlePropertyTypeChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, propertyType: value }))
  }

  const handleLocationChange = (value: string) => {
    // When a location is selected from Google Places API, this function is called
    // Update both the state and the ref to ensure we have the latest value
    searchQueryRef.current = value

    setSearchParams((prev) => ({
      ...prev,
      searchQuery: value,
    }))

    console.log("Location changed to:", value) // Debug log
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
        <PlacesAutocomplete
          value={searchParams.searchQuery}
          onChange={handleLocationChange}
          onKeyPress={handleKeyPress}
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

