"use client";

import Link from "next/link";
import { useState } from "react";

import { DataTable } from "@/components/dataTable/data-table";
import { Loader } from "@/components/loader";
import { RoleGate } from "@/components/rbac/role-gate";
import { Button } from "@/components/ui/button";
import { COMPANY_PATHS } from "@/constants/paths";
import { companiesProperties } from "@/services/dashboard/properties";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";

import { columns } from "./columns";

export default function PropertiesListing() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    data: dataCompaniesProperties,
    isLoading: isLoadingProperties,
    isFetching: isFetchingProperties,
  } = useQuery({
    queryKey: ["companiesProperties"],
    queryFn: companiesProperties,
  });

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3>Property Data</h3>
        <Link className="cursor-pointer" href={COMPANY_PATHS.addNewProperty}>
          <Button>+Add New Property</Button>
        </Link>
      </div>
      <div className="bg-white rounded-md shadow mb-10">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h4>My Properties</h4>
            <Button>Filters</Button>
          </div>
          <div className="relative">
            <Loader
              variant="inline"
              isLoading={isLoadingProperties || isFetchingProperties}
            ></Loader>

            <div className="mx-auto container py-5">
              <RoleGate allowedRoles={["customer", "admin", "owner"]}>
                <DataTable
                  columns={columns}
                  data={dataCompaniesProperties?.results || []}
                  sorting={sorting}
                  onSortingChange={setSorting}
                />
              </RoleGate>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md shadow mb-10">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h4>Agent’s Properties</h4>
            <Button>Filters</Button>
          </div>
          <div className="relative">
            <Loader
              variant="inline"
              isLoading={isLoadingProperties || isFetchingProperties}
            ></Loader>

            <div className="mx-auto container py-5">
              <DataTable
                columns={columns}
                data={dataCompaniesProperties?.results || []}
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
