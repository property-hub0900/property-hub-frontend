"use client";

import Pagination from "@/components/pagination";
import { PropertyListCard } from "@/components/property/property-list-card";
import { PropertySearchFilters } from "@/components/property/property-search-filters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { propertyServices } from "@/services/public/properties";
import type { IPropertyFilters } from "@/types/public/properties";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertiesPage() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IPropertyFilters>({
    searchQuery: searchParams.get("searchQuery") || undefined,
    propertyType: searchParams.get("propertyType") || undefined,
    purpose: searchParams.get("purpose") || undefined,
    bedrooms: searchParams.get("bedrooms") || undefined,
    bathrooms: searchParams.get("bathrooms") || undefined,
    priceMin: searchParams.get("priceMin") || undefined,
    priceMax: searchParams.get("priceMax") || undefined,
    amenitiesIds: searchParams.get("amenitiesIds")?.split(",") || undefined,
    furnishing: searchParams.get("furnishedType") || undefined,
    minArea: searchParams.get("propertySizeMin") || undefined,
    maxArea: searchParams.get("propertySizeMax") || undefined,
    page: searchParams.get("page") || "0",
    pageSize: searchParams.get("pageSize") || "10",
    sortBy: searchParams.get("sortBy") || undefined,
    address: searchParams.get("address") || undefined,
  });

  useEffect(() => {
    setFilters({
      searchQuery: searchParams.get("searchQuery") || undefined,
      propertyType: searchParams.get("propertyType") || undefined,
      purpose: searchParams.get("purpose") || undefined,
      bedrooms: searchParams.get("bedrooms") || undefined,
      bathrooms: searchParams.get("bathrooms") || undefined,
      priceMin: searchParams.get("priceMin") || undefined,
      priceMax: searchParams.get("priceMax") || undefined,
      amenitiesIds: searchParams.get("amenitiesIds")?.split(",") || undefined,
      furnishing: searchParams.get("furnishedType") || undefined,
      minArea: searchParams.get("propertySizeMin") || undefined,
      maxArea: searchParams.get("propertySizeMax") || undefined,
      page: searchParams.get("page") || "0",
      pageSize: searchParams.get("pageSize") || "10",
      sortBy: searchParams.get("sortBy") || undefined,
      address: searchParams.get("address") || undefined,
    });
  }, [searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => propertyServices.fetchProperties(filters),
  });

  const totalPages = data?.total
    ? Math.ceil(data?.total / Number(filters.pageSize || 10))
    : 0;

  return (
    <div className="container mx-auto py-14">
      <PropertySearchFilters />
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-3">
        <div className="w-full hidden lg:block">
          <Image
            src={"/add1.jpg"}
            width={500}
            height={300}
            alt="#"
            className="w-full h-auto"
          />
        </div>
        <div>
          <div className="space-y-5">
            {isLoading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-72 w-full" />
                ))}
              </>
            ) : error ? (
              <>
                <Alert variant="destructive" className="mt-8">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to fetch properties. Please try again later.
                  </AlertDescription>
                </Alert>
              </>
            ) : !data?.results?.length ? (
              <>
                <div className="mt-8 flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-semibold">
                    No properties found
                  </h2>
                  <p className="text-muted-foreground">
                    Try adjusting your search filters to find more properties.
                  </p>
                </div>
              </>
            ) : (
              <>
                {data.results.map((property) => (
                  <PropertyListCard key={property.propertyId} data={property} />
                ))}

                {totalPages > 1 && (
                  <Pagination
                    currentPage={Number(filters.page) || 0}
                    totalPages={totalPages}
                    totalItems={data.total}
                    pageSize={Number(filters.pageSize) || 10}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-full hidden lg:block">
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
