"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PropertyListing from "./components/property-listing";
import SearchBar from "./components/search-bar";

import type { PropertyFilters } from "@/types/client/properties";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { fetchProperties } from "@/services/properties";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>({
    location: searchParams.get("location") || undefined,
    rent: searchParams.get("rent") || undefined,
    propertyType: searchParams.get("propertyType") || undefined,
    bedsAndBath: searchParams.get("bedsAndBath") || undefined,
    price: searchParams.get("price") || undefined,
    page: searchParams.get("page")
      ? Number.parseInt(searchParams.get("page")!)
      : 0,
    pageSize: 5,
  });

  // Update filters when search params change
  useEffect(() => {
    setFilters({
      location: searchParams.get("location") || undefined,
      rent: searchParams.get("rent") || undefined,
      propertyType: searchParams.get("propertyType") || undefined,
      bedsAndBath: searchParams.get("bedsAndBath") || undefined,
      price: searchParams.get("price") || undefined,
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : 0,
      pageSize: 5,
    });
  }, [searchParams]);

  // Fetch properties with React Query
  //const { data, isLoading, isError, error } = useProperties(filters);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => fetchProperties(filters),
  });

  // Extract properties and pagination info
  const properties = data?.results || [];
  const totalPages = data?.total || 0;
  const currentPage = data?.page || 1;

  return (
    <main className="container mx-auto px-4 py-6">
      <SearchBar />

      {/* Debug section - can be removed in production */}
      {/* {Object.keys(filters).length > 0 && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-blue-800">
          <p className="font-semibold">Active filters:</p>
          <ul className="mt-1 list-inside list-disc">
            {Object.entries(filters).map(([key, value]) =>
              value && key !== "pageSize" ? (
                <li key={key}>
                  <span className="font-semibold">{key}:</span> {value}
                </li>
              ) : null
            )}
          </ul>
          <p className="mt-1">Found {data?.total || 0} properties</p>
        </div>
      )} */}

      {/* Error state */}
      {isError && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load properties"}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <div className="w-52 shrink-0">
          <img src="/add1.jpg" alt="#" />
        </div>
        <div className="w-full grow">
          {/* Loading state */}
          {isLoading && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[400px] w-full rounded-lg" />
              ))}
            </div>
          )}

          {/* Properties list */}
          {!isLoading && !isError && (
            <div className="space-y-6">
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <PropertyListing key={index} data={property} />
                ))
              ) : (
                <div className="rounded-lg border p-8 text-center">
                  <h3 className="text-lg font-medium">No properties found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your search filters
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && properties.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                filters={filters}
              />
            </div>
          )}
        </div>
        <div className="w-52 shrink-0">
          <img src="/add1.jpg" alt="#" />
        </div>
      </div>
    </main>
  );
}

// Pagination component
function PaginationControls({
  currentPage,
  totalPages,
  filters,
}: {
  currentPage: number;
  totalPages: number;
  filters: PropertyFilters;
}) {
  // Function to generate URL with updated page parameter
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();

    // Add all existing filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== "page" && key !== "pageSize" && value) {
        params.set(key, value.toString());
      }
    });

    // Add the page parameter
    params.set("page", page.toString());

    return `?${params.toString()}`;
  };

  return (
    <>
      {currentPage > 1 && (
        <a
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-1 text-sm text-muted-foreground"
        >
          ← Previous
        </a>
      )}

      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const pageNumber = i + 1;
        return (
          <a
            key={pageNumber}
            href={getPageUrl(pageNumber)}
            className={`px-3 py-1 text-sm ${
              currentPage === pageNumber
                ? "rounded-md bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            {pageNumber}
          </a>
        );
      })}

      {currentPage < totalPages && (
        <a
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-1 text-sm text-muted-foreground"
        >
          Next →
        </a>
      )}
    </>
  );
}
