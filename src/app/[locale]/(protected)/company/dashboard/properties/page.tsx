"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { COMPANY_PATHS } from "@/constants/paths";

import MyPropertiesTable from "./components/myPropertiesTable";

import { useQuery } from "@tanstack/react-query";
import { companiesProperties } from "@/services/protected/properties";
import { Loader } from "@/components/loader";
import { PERMISSIONS } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";

export default function PropertiesListing() {
  const {
    data: dataCompaniesProperties,
    isLoading: isLoadingProperties,
    isFetching: isFetchingProperties,
  } = useQuery({
    queryKey: ["companiesPropertiesSelf"],
    queryFn: () => companiesProperties("self"),
  });

  const { hasPermission } = useRBAC();

  return (
    <>
      <Loader
        variant="inline"
        isLoading={isLoadingProperties || isFetchingProperties}
      ></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>Property Data</h3>
        {hasPermission(PERMISSIONS.CREATE_PROPERTY) && (
          <Link className="cursor-pointer" href={COMPANY_PATHS.addNewProperty}>
            <Button>+Add New Property</Button>
          </Link>
        )}
      </div>
      {dataCompaniesProperties && (
        <MyPropertiesTable {...dataCompaniesProperties} />
      )}
    </>
  );
}
