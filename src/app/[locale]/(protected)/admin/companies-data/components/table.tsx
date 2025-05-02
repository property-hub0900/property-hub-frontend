"use client";

import { DataTable } from "@/components/dataTable/data-table";
import type { SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Columns } from "./columns";
import { ICompanyAdmin } from "@/types/protected/admin";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { sortTableData } from "@/utils/utils";

export default function CompaniesDataTable({
  data,
}: {
  data: ICompanyAdmin[];
}) {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [filters, setFilters] = useState<{
    status: string;
    companyName: string;
  }>({
    status: "",
    companyName: "",
  });

  const filteredAndSortedData = useMemo(() => {
    // First apply filters
    const filteredItems = data.filter((item) => {
      if (
        filters?.companyName &&
        !item.name.toLowerCase().includes(filters?.companyName.toLowerCase())
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

    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      return sortTableData(filteredItems, {
        field: id as keyof ICompanyAdmin,
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

  const handleChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="bg-white rounded-md shadow">
        <div className="p-4 md:p-6">
          <div className="flex gap-3 flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <h4>{t("sidebar.companiesData")}</h4>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Input
                  className="md:w-56"
                  name="companyName"
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder={t("form.companyName.label")}
                />
                <Search className="size-[20px] absolute right-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/50" />
              </div>
              <div className="relative">
                <Select
                  onValueChange={(val) => handleChange("status", val)}
                  defaultValue={filters.status}
                >
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder={t("form.status.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"Status"}>
                      {t("form.status.label")}
                    </SelectItem>
                    <SelectItem value={"active"}>
                      {t("form.status.options.active")}
                    </SelectItem>
                    <SelectItem value={"inactive"}>
                      {t("form.status.options.inactive")}
                    </SelectItem>
                    <SelectItem value={"rejected"}>
                      {t("form.status.options.rejected")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DataTable
            columns={Columns}
            data={filteredAndSortedData || []}
            sorting={sorting}
            onSortingChange={handleSortingChange}
          />
        </div>
      </div>
    </>
  );
}
