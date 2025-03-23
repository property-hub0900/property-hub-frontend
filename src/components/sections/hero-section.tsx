"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SearchTabs from "@/components/search/search-tabs"
import { Container } from "@/components/ui/container"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { propertyService } from "@/services/property"
import { FOR_RENT, FOR_SALE } from "@/constants"

type HeroSectionProps = {
  t: any
}

export default function HeroSection({ t }: HeroSectionProps) {
  // Update the searchParams state to include all API parameters
  const [searchParams, setSearchParams] = useState({
    propertyType: "all",
    searchTerm: "",
    listingType: "buy", // This maps to 'purpose' in the API
    amenitiesIds: "",
    bedrooms: undefined as number | undefined,
    bathrooms: undefined as number | undefined,
    priceMin: undefined as number | undefined,
    priceMax: undefined as number | undefined,
    page: 0,
    pageSize: 999,
  })

  // Update the query function to map our UI parameters to API parameters
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["properties", searchParams],
    queryFn: () =>
      propertyService.getPropertiesBy({
        searchQuery: searchParams.searchTerm,
        propertyType: searchParams.propertyType === "all" ? undefined : searchParams.propertyType,
        purpose: searchParams.listingType === "buy" ? FOR_SALE : FOR_RENT,
        amenitiesIds: searchParams.amenitiesIds || undefined,
        bedrooms: searchParams.bedrooms,
        bathrooms: searchParams.bathrooms,
        priceMin: searchParams.priceMin,
        priceMax: searchParams.priceMax,
        page: searchParams.page,
        pageSize: searchParams.pageSize,
      }),
    enabled: false, // Don't fetch on component mount, only when search button is clicked
  })

  // Update the handleTabChange function to map to the API's 'purpose' parameter
  const handleTabChange = (tab: string) => {
    setSearchParams((prev) => ({ ...prev, listingType: tab }))
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
                isLoading={isLoading}
                onSearch={refetch}
              />
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
    searchTerm: string
    listingType: string
    amenitiesIds: string
    bedrooms?: number
    bathrooms?: number
    priceMin?: number
    priceMax?: number
    page: number
    pageSize: number
  }
  setSearchParams: React.Dispatch<
    React.SetStateAction<{
      propertyType: string
      searchTerm: string
      listingType: string
      amenitiesIds: string
      bedrooms?: number
      bathrooms?: number
      priceMin?: number
      priceMax?: number
      page: number
      pageSize: number
    }>
  > | any
  isLoading: boolean
  onSearch: () => void
}

function SearchForm({ t, searchParams, setSearchParams, isLoading, onSearch }: SearchFormProps) {
  const handlePropertyTypeChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, propertyType: value }))
  }

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({ ...prev, searchTerm: e.target.value }))
  }

  return (
    <div className="flex flex-col bg-card sm:flex-row items-center p-4 rounded-sm rounded-tl-none">
      <div className="w-full sm:w-1/4 mb-3 sm:mb-0 sm:mr-3">
        <Select value={searchParams.propertyType} onValueChange={handlePropertyTypeChange}>
          <SelectTrigger className="w-full border border-input rounded-md h-10 text-primary font-bold ">
            <SelectValue className="text-black" placeholder={t("search.propertyType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null as any}>{t("search.allProperties")}</SelectItem>
            <SelectItem value="House">{t("search.house")}</SelectItem>
            <SelectItem value="Apartment">{t("search.apartment")}</SelectItem>
            <SelectItem value="Villa">{t("search.villa")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full mb-3 sm:mb-0 sm:mr-3 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          className="pl-10 border border-input rounded-md h-10 w-full text-primary/100 font-bold"
          placeholder={t("search.placeholder")}
          value={searchParams.searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
      <Button
        className="w-full sm:w-1/6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-10"
        onClick={onSearch}
        disabled={isLoading}
      >
        {isLoading ? t("search.searching") : t("search.button")}
      </Button>
    </div>
  )
}

