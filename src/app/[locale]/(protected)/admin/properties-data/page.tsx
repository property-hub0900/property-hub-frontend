"use client";

import { Loader } from "@/components/loader";

import { adminServices } from "@/services/protected/admin";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { PropertiesTable } from "./components/table";

export default function PropertiesListing() {
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
