"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { COMPANY_PATHS } from "@/constants/paths";

import { PropertiesTable } from "./components/properties-table";

import { Loader } from "@/components/loader";
import { PERMISSIONS } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";
import { companiesProperties } from "@/services/protected/properties";

import { useQuery } from "@tanstack/react-query";
import { adminServices } from "@/services/protected/admin";

export default function PropertiesListing() {
  const { hasPermission } = useRBAC();
  const t = useTranslations();

  const {
    data: dataCompaniesProperties,
    isLoading: isLoadingProperties,
    isFetching: isFetchingProperties,
  } = useQuery({
    queryKey: ["getAdminProperties"],
    queryFn: () => adminServices.getAdminProperties(),
  });

  return (
    <>
      <Loader
        variant="inline"
        isLoading={isLoadingProperties || isFetchingProperties}
      ></Loader>

      {dataCompaniesProperties && (
        <PropertiesTable data={dataCompaniesProperties.results || []} />
      )}
    </>
  );
}
