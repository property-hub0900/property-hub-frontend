"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dataTable/data-table";
import type { SortingState } from "@tanstack/react-table";

import { SavedSearchesColumns } from "./customers-columns";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ICustomersData {
  // isError: false;
  // page: 0;
  // pageSize: 20;
  results: ICustomer[];
  //total: 0;
}

export interface ICustomer {
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string; // ISO format or display string
  status: "active" | "inactive" | "pending";
}

export default function CustomersDataTable({ data }: { data: ICustomer[] }) {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [filters, setFilters] = useState<{ status: string }>({ status: "" });

  const filteredAndSortedData = useMemo(() => {
    // First apply filters
    const filteredItems = data.filter((item) => {
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
      const { id: sortField, desc } = sorting[0];

      filteredItems.sort((a, b) => {
        const aValue = a[sortField as keyof ICustomer];
        const bValue = b[sortField as keyof ICustomer];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return desc
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        if (aValue < bValue) return desc ? 1 : -1;
        if (aValue > bValue) return desc ? -1 : 1;
        return 0;
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
      <div className="bg-white rounded-md shadow mb-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h5>Customers Listing</h5>
            <div>
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
                    <SelectItem value={"pending"}>Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DataTable
            columns={SavedSearchesColumns}
            data={filteredAndSortedData || []}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </div>
      </div>
    </>
  );
}
