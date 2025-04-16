"use client";

import { DataTable } from "@/components/dataTable/data-table";
import type { IProperty } from "@/types/protected/properties";
import type { SortingState } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { propertiesTableColumns } from "./properties-table-columns";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { MoreFiltersDialog } from "./more-filters-dialog";

export interface IPropertyDataFilters {
  title?: string;
  referenceNo?: string;
  publisher?: string;
  featured?: string;
  propertyType?: string;
  status?: string;
}

import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import { Search } from "lucide-react";
import { IOption } from "@/types/common";
import { staffList } from "@/services/protected/properties";

const initFilters = {
  title: "",
  referenceNo: "",
  publisher: "",
  featured: "",
  propertyType: "",
  status: "",
};

export const PropertiesTable = ({ data }: { data: IProperty[] }) => {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [filters, setFilters] = useState<IPropertyDataFilters>(initFilters);

  const handleFilters = (filters: IPropertyDataFilters) => {
    setFilters((prev) => ({ ...prev, ...filters }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (
        filters?.title &&
        !item.title.toLowerCase().includes(filters?.title.toLowerCase())
      )
        return false;

      if (
        filters?.referenceNo &&
        !item.referenceNo.includes(filters?.referenceNo)
      )
        return false;

      if (filters?.publisher && filters?.publisher != `publisher`) {
        if (`${item.postedBy}` !== filters?.publisher) return false;
      }

      if (filters?.featured && filters?.featured != `featuredStatus`) {
        const shouldBeFeatured = filters.featured === "featured";
        if (item.featured !== shouldBeFeatured) return false;
      }

      if (
        filters?.propertyType &&
        filters?.propertyType != `${t("form.propertyType.label")}` &&
        item.propertyType.toLowerCase() !== filters?.propertyType.toLowerCase()
      )
        return false;

      if (
        filters?.status &&
        filters?.status != `${t("form.propertyStatuses.label")}` &&
        item.status.toLowerCase() !== filters?.status.toLowerCase()
      )
        return false;

      return true;
    });
  }, [filters, data]);

  console.log("filters", filters);
  console.log("filteredData", filteredData);

  return (
    <>
      <div className="bg-white rounded-md shadow mb-10">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h4>{t("title.properties")}</h4>
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  className="w-40"
                  name="referenceNo"
                  onChange={handleChange}
                  placeholder={t("form.referenceNo.label")}
                />
                <Search className="size-[20px] absolute right-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50" />
              </div>
              <div className="relative">
                <Input
                  name="title"
                  onChange={handleChange}
                  placeholder={`${t("button.search")} ${t("form.title.label")}`}
                />
                <Search className="size-[20px] absolute right-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50" />
              </div>

              <MoreFiltersDialog
                filters={filters}
                handleFilters={handleFilters}
              />
            </div>
          </div>
          <div className="relative">
            <div className="py-5">
              <DataTable
                columns={propertiesTableColumns}
                data={filteredData}
                sorting={sorting}
                onSortingChange={setSorting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
