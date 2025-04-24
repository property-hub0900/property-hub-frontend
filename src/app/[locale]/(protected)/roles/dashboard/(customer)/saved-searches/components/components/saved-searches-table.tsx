"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dataTable/data-table";
import type { SortingState } from "@tanstack/react-table";

import { SavedSearchesColumns } from "./saved-searches-columns";
import { ISavedSearch, ISavedSearches } from "@/types/protected/properties";

export default function SavedSearchesTable(data: ISavedSearches) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const getSortedData = useMemo(() => {
    if (sorting.length > 0) {
      const { id: sortField, desc } = sorting[0];

      return [...data.results].sort((a, b) => {
        const aValue = a[sortField as keyof ISavedSearch[]];
        const bValue = b[sortField as keyof ISavedSearch[]];

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
    return data.results;
  }, [data, sorting]);

  return (
    <>
      <div className="bg-white rounded-md shadow mb-10">
        <div className="p-6">
          {/* <div className="flex justify-between items-center">
            <h4>Saved Searches</h4>
          </div> */}

          <DataTable
            columns={SavedSearchesColumns}
            data={getSortedData || []}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </div>
      </div>
    </>
  );
}
