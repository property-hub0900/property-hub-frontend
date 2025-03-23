"use client";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "@/components/dataTable/data-table";
import { properties } from "@/services/dashboard/properties";
import { IProperty } from "@/types/dashboard/properties";

export default function PropertiesListing() {
  const { data: dataProperties } = useQuery({
    queryKey: ["properties"],
    queryFn: properties,
  });

  console.log("dataProperties", dataProperties);

  return (
    <div className="mx-auto container py-5">
      <DataTable columns={columns} data={dataProperties?.data?.results || []} />
    </div>
  );
}
