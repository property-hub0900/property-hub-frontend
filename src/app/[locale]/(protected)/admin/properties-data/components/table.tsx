"use client";

import { DataTable } from "@/components/dataTable/data-table";
import type {
  IProperty,
  IPropertyDataFilters,
} from "@/types/protected/properties";
import type { SortingState } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { propertiesTableColumns } from "./columns";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { MoreFiltersDialog } from "../../../company/properties/components/more-filters-dialog";

import { Search } from "lucide-react";
import { IAdminProperty } from "@/types/protected/admin";
import { sortTableData } from "@/utils/utils";

const initFilters = {
  title: "",
  referenceNo: "",
  companyName: "",
  featured: "",
  propertyType: "",
  status: "",
};

export const PropertiesTable = ({ data }: { data: IAdminProperty[] }) => {
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

  const filteredAndSortedData = useMemo(() => {
    // First apply filters
    const filteredItems = data.filter((item) => {
      if (
        filters?.title &&
        !item.title.toLowerCase().includes(filters?.title.toLowerCase())
      )
        return false;

      if (
        filters?.referenceNo &&
        !item.referenceNo
          .toLowerCase()
          .includes(filters?.referenceNo.toLowerCase())
      )
        return false;

      // if (filters?.companyName && filters?.companyName != `companyName`) {
      //   if (`${item.company.companyId}` !== filters?.companyName) return false;
      // }

      if (filters?.companyName && filters?.companyName != `companyName`) {
        if (
          !item.company.companyName
            .toLowerCase()
            .includes(filters?.companyName.toLowerCase())
        )
          return false;
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

    // Then apply sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      return sortTableData(filteredItems, {
        field: id as keyof IAdminProperty,
        direction: desc ? "desc" : "asc",
      });
    }

    return filteredItems;
  }, [filters, sorting, data]);

  const handleSortingChange = (
    updaterOrValue: SortingState | ((prev: SortingState) => SortingState)
  ) => {
    setSorting(updaterOrValue);
  };

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
                data={filteredAndSortedData || []}
                sorting={sorting}
                onSortingChange={handleSortingChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
