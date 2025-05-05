"use client";

import Pagination from "@/components/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { propertyServices } from "@/services/public/properties";
import type { ICompanyFilters } from "@/types/public/properties";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CompanyListCard } from "@/components/property/company-list-card";
import { CompanySearchFilters } from "@/components/property/company-search-filters";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const t = useTranslations();

  const searchFilters = {
    name: searchParams.get("name") || undefined,
    page: searchParams.get("page") || "0",
    pageSize: searchParams.get("pageSize") || "10",
  };

  const [filters, setFilters] = useState<ICompanyFilters>(searchFilters);

  useEffect(() => {
    setFilters(searchFilters);
  }, [searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["companies", filters],
    queryFn: () => propertyServices.fetchCompanies(filters),
  });

  const totalPages = data?.total
    ? Math.ceil(data?.total / Number(filters.pageSize || 10))
    : 0;

  return (
    <div className="container mx-auto py-8 md:py-12">
      <CompanySearchFilters />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-44 w-full" />
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
              <p className="text-muted-foreground">
                {t("text.notRecordFound")}
              </p>
            </div>
          </>
        ) : (
          <>
            {data.results.map((item) => (
              <CompanyListCard key={item.companyId} data={item} />
            ))}
            <div className="col-span-2">
              {totalPages > 1 && (
                <Pagination
                  currentPage={Number(filters.page) || 0}
                  totalPages={totalPages}
                  totalItems={data.total}
                  pageSize={Number(filters.pageSize) || 10}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
