"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dataTable/data-table";
import type { SortingState } from "@tanstack/react-table";

import { Columns } from "./columns";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IAdminPoints } from "@/types/protected/admin";
import { sortTableData } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function TopUpsTable({ data }: { data: IAdminPoints[] }) {
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
        !item.companyName
          .toLowerCase()
          .includes(filters?.companyName.toLowerCase())
      )
        return false;

      if (filters?.status && filters?.status !== `${t("form.status.label")}`) {
        if (item.status !== filters?.status) return false;
      }

      return true;
    });

    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      return sortTableData(filteredItems, {
        field: id as keyof IAdminPoints,
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
      <div className="bg-white rounded-md shadow mb-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h4>{t("sidebar.topUpRequests")}</h4>
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  className="w-56"
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
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t("form.status.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"Status"}>
                      {t("form.status.label")}
                    </SelectItem>
                    <SelectItem value={"approved"}>
                      {t("form.status.options.approved")}
                    </SelectItem>
                    <SelectItem value={"pending"}>
                      {t("form.status.options.pending")}
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
