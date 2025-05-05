"use client";

import { DataTable } from "@/components/dataTable/data-table";
import type {
  IProperty,
  IPropertyDataFilters,
} from "@/types/protected/properties";
import type { SortingState } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { propertiesTableColumns } from "./properties-table-columns";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { MoreFiltersDialog } from "./more-filters-dialog";

import { Search } from "lucide-react";
import { sortTableData } from "@/utils/utils";

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

  const filteredAndSortedData = useMemo(() => {
    // First apply filters
    const filteredItems = data.filter((item) => {
      if (
        filters?.title &&
        !item.title.toLowerCase().includes(filters?.title.toLowerCase())
      )
        return false;

      if (filters?.referenceNo && item.referenceNo !== filters?.referenceNo)
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

    // Then apply sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      return sortTableData(filteredItems, {
        field: id as keyof IProperty,
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

  //console.log("filters", filters);
  // console.log("filteredData", filteredData);

  return (
    <>
      <div className="bg-white rounded-md shadow">
        <div className="p-4 md:p-6">
          <div className="flex gap-3 flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <h4>{t("title.properties")}</h4>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Input
                  className="md:w-40"
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
                //data={filteredData}
                //data={getSortedData(filteredData, sorting)}
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
