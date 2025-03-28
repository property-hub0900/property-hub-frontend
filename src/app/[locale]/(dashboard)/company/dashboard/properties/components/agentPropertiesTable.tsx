"use client";

import { useState } from "react";

import { DataTable } from "@/components/dataTable/data-table";
import { SortingState } from "@tanstack/react-table";

import { agentPropertiesTableColumns } from "./agentPropertiesTableColumns";
import { IProperties } from "@/types/dashboard/properties";

export default function AgentPropertiesTable(data: IProperties) {
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <>
      <div className="bg-white rounded-md shadow mb-10">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h4>Agent Properties</h4>
            {/* <Button>Filters</Button> */}
          </div>
          <div className="relative">
            <div className="mx-auto container py-5">
              <DataTable
                columns={agentPropertiesTableColumns}
                data={data?.results || []}
                sorting={sorting}
                onSortingChange={setSorting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
