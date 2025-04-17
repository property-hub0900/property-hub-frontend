"use client";

import { useState } from "react";
import { DataTable } from "@/components/dataTable/data-table";
import type { SortingState } from "@tanstack/react-table";

import { SavedSearchesColumns } from "./saved-searches-columns";
import { ISavedSearches } from "@/types/protected/properties";

export default function SavedSearchesTable(data: ISavedSearches) {
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <>
      <div className="bg-white rounded-md shadow mb-10">
        <div className="p-6">
          {/* <div className="flex justify-between items-center">
            <h4>Saved Searches</h4>
          </div> */}

          <DataTable
            columns={SavedSearchesColumns}
            data={data?.results || []}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </div>
      </div>
    </>
  );
}
