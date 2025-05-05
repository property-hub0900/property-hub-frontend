"use client";

import Pagination from "@/components/pagination";
import { PropertyListCard } from "@/components/property/property-list-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { propertyServices } from "@/services/public/properties";
import type { IPropertyFilters } from "@/types/public/properties";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CompanyPropertySearchFilters } from "@/components/property/company-property-search-filters";

export default function PropertiesPage() {
  const params = useParams<{ id: string }>();

  const searchParams = useSearchParams();
  const t = useTranslations();

  const searchFilters = {
    companyId: params.id,
    purpose: searchParams.get("purpose") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
  };

  const [filters, setFilters] = useState<IPropertyFilters>(searchFilters);

  useEffect(() => {
    setFilters(searchFilters);
  }, [searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => propertyServices.fetchProperties(filters),
  });

  const totalPages = data?.total
    ? Math.ceil(data?.total / Number(filters.pageSize || 10))
    : 0;

  return (
    <div className="container mx-auto py-8 md:py-12">
      <CompanyPropertySearchFilters />
      <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_200px] gap-3">
        <div className="hidden xl:block">
          <div className="sticky top-0">
            <Image
              src={"/add1.jpg"}
              width={500}
              height={300}
              alt="#"
              className="w-full h-auto"
            />
          </div>
        </div>

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
                <AlertTitle>{t("text.error")}</AlertTitle>
                <AlertDescription>{t("text.failedToFetch")}</AlertDescription>
              </Alert>
            </>
          ) : !data?.results?.length ? (
            <>
              <div className="mt-8 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-semibold">
                  {t("text.noPropertyFound")}
                </h2>
                <p className="text-muted-foreground">
                  {t("text.noPropertyFoundDesc")}
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

        <div className="hidden xl:block">
          <div className="sticky top-0">
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
    </div>
  );
}
