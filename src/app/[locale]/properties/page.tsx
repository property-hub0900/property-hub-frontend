"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import PropertyListing from "./components/property-listing"
import SearchBar from "./components/search-bar"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchProperties } from "@/services/properties"
import type { PropertyFilters } from "@/types/client/properties"
import { useQuery } from "@tanstack/react-query"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

export default function PropertiesPage() {
  const searchParams = useSearchParams()


  const [filters, setFilters] = useState<PropertyFilters>({
    searchQuery: searchParams.get("searchQuery") || undefined,
    propertyType: searchParams.get("propertyType") || undefined,
    purpose: searchParams.get("purpose") || undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    bathrooms: searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : undefined,
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    amenitiesIds: searchParams.get("amenitiesIds") || undefined,
    furnishing: searchParams.get("furnishing") || undefined,
    minArea: searchParams.get("minArea") ? Number(searchParams.get("minArea")) : undefined,
    maxArea: searchParams.get("maxArea") ? Number(searchParams.get("maxArea")) : undefined,
    keywords: searchParams.get("keywords") || undefined,
    companyId: searchParams.get("companyId") ? Number(searchParams.get("companyId")) : undefined,
    page: searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 0,
    pageSize: 10,
  })


  useEffect(() => {
    setFilters({
      searchQuery: searchParams.get("searchQuery") || undefined,
      propertyType: searchParams.get("propertyType") || undefined,
      purpose: searchParams.get("purpose") || undefined,
      bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
      bathrooms: searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : undefined,
      priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
      priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
      amenitiesIds: searchParams.get("amenitiesIds") || undefined,
      furnishing: searchParams.get("furnishing") || undefined,
      minArea: searchParams.get("minArea") ? Number(searchParams.get("minArea")) : undefined,
      maxArea: searchParams.get("maxArea") ? Number(searchParams.get("maxArea")) : undefined,
      keywords: searchParams.get("keywords") || undefined,
      companyId: searchParams.get("companyId") ? Number(searchParams.get("companyId")) : undefined,
      page: searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 0,
      pageSize: 10,
    })
  }, [searchParams])

  // Fetch properties with React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => fetchProperties(filters),
  })


  const properties = data?.results || []
  const totalPages = Math.ceil((data?.total || 0) / (filters.pageSize || 10))
  const currentPage = filters.page || 0



  return (
    <main className="container mx-auto px-4 py-6">
      <SearchBar />

      {/* Error state */}
      {isError && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error instanceof Error ? error.message : "Failed to load properties"}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-3">
        <div className="w-full mb-4 lg:mb-0 order-1">
          <Image src="/add1.jpg" alt="PropertyExplorer" className="w-full h-auto" width={200} height={200} />
        </div>
        <div className="w-full order-3 lg:order-2">
          {/* Loading state */}
          {isLoading && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[250px] sm:h-[300px] md:h-[400px] w-full rounded-lg" />
              ))}
            </div>
          )}

          {/* Properties list */}
          {!isLoading && !isError && (
            <div className="space-y-6 gap-2">
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <PropertyListing key={property.propertyId || index} data={property} />
                ))
              ) : (
                <div className="rounded-lg border p-8 text-center">
                  <h3 className="text-lg font-medium">No properties found</h3>
                  <p className="mt-2 text-muted-foreground">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && properties.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <PaginationControls currentPage={currentPage} totalPages={totalPages} filters={filters} />
            </div>
          )}
        </div>
        <div className="w-full mt-4 lg:mt-0 order-2 lg:order-3">
          <img src="/add1.jpg" alt="Advertisement" className="w-full h-auto" />
        </div>
      </div>
    </main>
  )
}

// Pagination component
function PaginationControls({
  currentPage,
  totalPages,
  filters,
}: {
  currentPage: number
  totalPages: number
  filters: PropertyFilters
}) {
  // Function to generate URL with updated page parameter
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()

    // Add all existing filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== "page" && key !== "pageSize" && value) {
        params.set(key, value.toString())
      }
    })

    // Add the page parameter
    params.set("page", page.toString())

    return `?${params.toString()}`
  }

  return (
    <>
      {currentPage > 0 && (
        <a href={getPageUrl(currentPage - 1)} className="px-3 py-1 text-sm text-muted-foreground">
          ← Previous
        </a>
      )}

      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const pageNumber = i
        return (
          <a
            key={pageNumber}
            href={getPageUrl(pageNumber)}
            className={`px-3 py-1 text-sm ${currentPage === pageNumber ? "rounded-md bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
          >
            {pageNumber + 1}
          </a>
        )
      })}

      {currentPage < totalPages - 1 && (
        <a href={getPageUrl(currentPage + 1)} className="px-3 py-1 text-sm text-muted-foreground">
          Next →
        </a>
      )}
    </>
  )
}

