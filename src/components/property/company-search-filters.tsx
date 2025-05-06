"use client";

import { Button } from "@/components/ui/button";
import { ICompanyFilters } from "@/types/public/properties";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";

export const CompanySearchFilters = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilters: ICompanyFilters = {
    name: searchParams.get("name") || "",
    page: searchParams.get("page") || "0",
    pageSize: searchParams.get("pageSize") || "10",
  };

  const [filters, setFilters] = useState<ICompanyFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [searchParams]);

  const updateURL = useCallback(
    (filters: ICompanyFilters) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value &&
          (typeof value === "string" ? value.trim() : value.length > 0)
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
    (name: keyof ICompanyFilters, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [name]: value };

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
          (typeof value === "string" ? value.trim() : value.length > 0)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearAllFilters = useCallback(() => {
    const newFilters = {
      name: "",
      page: "0",
      pageSize: "10",
    };
    setFilters(newFilters);
    setTimeout(() => {
      router.push("?");
    }, 500);
  }, [router]);

  return (
    <form onSubmit={handleSearch} className="">
      <div className="flex  gap-2 mb-10">
        <div className="relative flex-1">
          <Input
            placeholder={`${t("form.companyName.label")}`}
            className="h-11"
            value={filters.name || ""}
            onChange={(e) => handleSelectChange("name", e.target.value)}
          />
        </div>

        <Button type="submit" className="w-10 lg:w-auto">
          {t("button.find")}
        </Button>
      </div>
    </form>
  );
};
