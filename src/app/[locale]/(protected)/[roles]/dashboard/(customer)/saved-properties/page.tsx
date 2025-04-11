"use client";

import Pagination from "@/components/pagination";
import { PropertyListCard } from "@/components/property/property-list-card";
import { customerService } from "@/services/protected/customer";
import { IPropertyFilters } from "@/types/public/properties";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const searchFilters = {
    page: searchParams.get("page") || "0",
    pageSize: searchParams.get("pageSize") || "10",
  };

  const [filters, setFilters] = useState<IPropertyFilters>(searchFilters);

  useEffect(() => {
    setFilters(searchFilters);
  }, [searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => customerService.getFavoriteProperties(filters),
  });

  const totalPages = data?.total
    ? Math.ceil(data?.total / Number(filters.pageSize || 10))
    : 0;

  return (
    <div>
      <h3 className="mb-5">Saved Properties</h3>
      <div className="space-y-5 max-w-5xl">
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
              <h2 className="text-2xl font-semibold">No properties found</h2>
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
  );
}
