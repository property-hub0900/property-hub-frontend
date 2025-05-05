"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROPERTY_PURPOSE, PROPERTY_SORT_BY } from "@/constants/constants";

import { IPropertyFilters } from "@/types/public/properties";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const CompanyPropertySearchFilters = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = Object.values(PROPERTY_SORT_BY).map((val) => ({
    label: t(`form.sortBy.options.${val}`),
    value: val,
  }));

  const initialFilters: IPropertyFilters = {
    purpose: searchParams.get("purpose") || t("form.propertyPurpose.label"),
    page: searchParams.get("page") || "0",
    pageSize: searchParams.get("pageSize") || "10",
    sortBy: searchParams.get("sortBy") || "featured",
  };

  const [filters, setFilters] = useState<IPropertyFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [searchParams]);

  const updateURL = useCallback(
    (filters: IPropertyFilters) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value &&
          (typeof value === "string" ? value.trim() : value.length > 0) &&
          !(key === "purpose" && value === t("form.propertyPurpose.label"))
        ) {
          if (Array.isArray(value)) {
            params.set(key, value.join(","));
          } else {
            params.set(key, value);
          }
        }
      });

      const urlParams = `?${params.toString()}`;

      router.push(urlParams);
    },
    [router]
  );

  const handleSelectChange = useCallback(
    (name: keyof IPropertyFilters, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: value };
        if (name === "sortBy" || name === "purpose") {
          // Use setTimeout to avoid state updates during render
          setTimeout(() => {
            updateURL(newFilters);
          }, 0);
        }
        return newFilters;
      });
    },
    [updateURL]
  );

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value &&
          (typeof value === "string" ? value.trim() : value.length > 0) &&
          !(key === "purpose" && value === t("form.propertyPurpose.label"))
        ) {
          if (Array.isArray(value)) {
            params.set(key, value.join(","));
          } else {
            params.set(key, value);
          }
        }
      });

      setTimeout(() => {
        router.push(`?${params.toString()}`);
      }, 500);
    },
    [filters, router, t]
  );

  return (
    <form onSubmit={handleSearch} className="">
      <div className="flex items-center gap-2 mb-10">
        <Select
          value={filters.purpose}
          onValueChange={(value) => handleSelectChange("purpose", value)}
        >
          <SelectTrigger className="w-auto h-11">
            <SelectValue placeholder="Purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={t("form.propertyPurpose.label")}>
              {t("form.propertyPurpose.label")}
            </SelectItem>
            {PROPERTY_PURPOSE.map((purpose) => (
              <SelectItem key={purpose} value={purpose}>
                {purpose === "For Sale" ? t("button.buy") : t("button.rent")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleSelectChange("sortBy", value)}
        >
          <SelectTrigger className="w-[120px] h-11">
            <SelectValue placeholder={t("form.sortBy.label")} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};
