"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyListing from "./components/property-listing";
import SearchBar from "./components/search-bar";
import Pagination from "./components/pagination";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProperties } from "@/services/properties";
import type {
  PropertyFilters,
  ClientProperty,
} from "@/types/client/properties";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

interface PropertyResponse {
  results: ClientProperty[];
  total: number;
  page: number;
  pageSize: number;
  isError: boolean;
}

export default function PropertiesPage() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilters>({
    searchQuery: searchParams.get("searchQuery") || undefined,
    propertyType: searchParams.get("propertyType") || undefined,
    purpose: searchParams.get("purpose") || undefined,
    bedrooms: searchParams.get("bedrooms")
      ? Number(searchParams.get("bedrooms"))
      : undefined,
    bathrooms: searchParams.get("bathrooms")
      ? Number(searchParams.get("bathrooms"))
      : undefined,
    priceMin: searchParams.get("priceMin")
      ? Number(searchParams.get("priceMin"))
      : undefined,
    priceMax: searchParams.get("priceMax")
      ? Number(searchParams.get("priceMax"))
      : undefined,
    amenitiesIds: searchParams.get("amenitiesIds") || undefined,
    furnishing: searchParams.get("furnishedType") || undefined,
    minArea: searchParams.get("propertySizeMin")
      ? Number(searchParams.get("propertySizeMin"))
      : undefined,
    maxArea: searchParams.get("propertySizeMax")
      ? Number(searchParams.get("propertySizeMax"))
      : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
    pageSize: searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : 10,
  });

  useEffect(() => {
    setFilters({
      searchQuery: searchParams.get("searchQuery") || undefined,
      propertyType: searchParams.get("propertyType") || undefined,
      purpose: searchParams.get("purpose") || undefined,
      bedrooms: searchParams.get("bedrooms")
        ? Number(searchParams.get("bedrooms"))
        : undefined,
      bathrooms: searchParams.get("bathrooms")
        ? Number(searchParams.get("bathrooms"))
        : undefined,
      priceMin: searchParams.get("priceMin")
        ? Number(searchParams.get("priceMin"))
        : undefined,
      priceMax: searchParams.get("priceMax")
        ? Number(searchParams.get("priceMax"))
        : undefined,
      amenitiesIds: searchParams.get("amenitiesIds") || undefined,
      furnishing: searchParams.get("furnishedType") || undefined,
      minArea: searchParams.get("propertySizeMin")
        ? Number(searchParams.get("propertySizeMin"))
        : undefined,
      maxArea: searchParams.get("propertySizeMax")
        ? Number(searchParams.get("propertySizeMax"))
        : undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
      pageSize: searchParams.get("pageSize")
        ? Number(searchParams.get("pageSize"))
        : 1,
    });
  }, [searchParams]);

  const { data, isLoading, error } = useQuery<PropertyResponse>({
    queryKey: ["properties", filters],
    queryFn: () => fetchProperties(filters),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <SearchBar />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <SearchBar />
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch properties. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="container mx-auto py-8">
        <SearchBar />
        <div className="mt-8 flex flex-col items-center justify-center">
          <Image
            src="/no-results.svg"
            alt="No results found"
            width={300}
            height={300}
            className="mb-4"
          />
          <h2 className="text-2xl font-semibold">No properties found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search filters to find more properties.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / (filters.pageSize || 10));

  return (
    <div className="container mx-auto py-8">
      <SearchBar />
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-3">
        <div className="w-full mb-4">
          <Image
            src={"/add1.jpg"}
            width={500}
            height={300}
            alt="#"
            className="w-full h-auto"
          />
        </div>
        <div>
          <div className="mb-5">
            {data.results.map((property) => (
              <PropertyListing key={property.propertyId} data={property} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={filters.page || 0}
              totalPages={totalPages}
              totalItems={data.total}
              pageSize={filters.pageSize || 10}
            />
          )}
        </div>
        <div className="w-full mb-4">
          <Image
            src={"/add1.jpg"}
            width={500}
            height={300}
            alt="#"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
