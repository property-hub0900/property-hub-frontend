"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "@/components/dataTable/data-table";
import { properties } from "@/services/dashboard/properties";
import { IProperty } from "@/types/dashboard/properties";
import { Loader } from "@/components/loader";
import { useState } from "react";
import { SortingState } from "@tanstack/react-table";

export default function PropertiesListing() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: dataProperties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties"],
    queryFn: properties,
  });

  return (
    <>
      <div className="relative">
        <Loader variant="inline" isLoading={isLoadingProperties}></Loader>
        <div className="mx-auto container py-5">
          <DataTable
            columns={columns}
            data={dataProperties?.results || []}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </div>
      </div>
    </>
  );
}
