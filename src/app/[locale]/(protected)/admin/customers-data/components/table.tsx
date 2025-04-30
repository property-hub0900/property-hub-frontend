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
import { ICustomerAdmin } from "@/types/protected/admin";
import { sortTableData } from "@/utils/utils";

export default function CustomersDataTable({
  data,
}: {
  data: ICustomerAdmin[];
}) {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [filters, setFilters] = useState<{ status: string }>({ status: "" });

  const filteredAndSortedData = useMemo(() => {
    // First apply filters

    const filteredItems = data.filter((item) => {
      if (
        filters?.status &&
        filters?.status !== `${t("form.propertyStatuses.label")}`
      ) {
        const statusBoolean = filters?.status.toLowerCase() === "active";
        if (item.user.status !== statusBoolean) {
          return false;
        }
      }

      return true;
    });

    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      return sortTableData(filteredItems, {
        field: id as keyof ICustomerAdmin,
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

  const handleChange = (val: string) => {
    //const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      ["status"]: val,
    }));
  };

  return (
    <>
      <div className="bg-white rounded-md shadow">
        <div className="p-4 md:p-6">
          <div className="flex gap-3 flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <h4>{t("sidebar.customersData")}</h4>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Select
                  onValueChange={(val) => handleChange(val)}
                  defaultValue={filters.status}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t("form.status.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"Status"}>Status</SelectItem>
                    <SelectItem value={"active"}>Active</SelectItem>
                    <SelectItem value={"inactive"}>InActive</SelectItem>
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
