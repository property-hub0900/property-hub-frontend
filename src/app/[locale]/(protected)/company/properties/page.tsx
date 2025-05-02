"use client";

import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { COMPANY_PATHS } from "@/constants/paths";
import { PERMISSIONS } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";
import { companiesProperties } from "@/services/protected/properties";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PropertiesTable } from "./components/properties-table";

export default function PropertiesListing() {
  const { hasPermission } = useRBAC();
  const t = useTranslations();

  const {
    data: dataCompaniesProperties,
    isLoading: isLoadingProperties,
    isFetching: isFetchingProperties,
  } = useQuery({
    queryKey: ["companiesProperties"],
    queryFn: () => companiesProperties(),
  });

  return (
    <>
      <Loader
        variant="inline"
        isLoading={isLoadingProperties || isFetchingProperties}
      ></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>{t("sidebar.propertyData")}</h3>
        {hasPermission(PERMISSIONS.CREATE_PROPERTY) && (
          <div className="flex gap-2">
            <Link
              className="cursor-pointer"
              href={COMPANY_PATHS.addNewProperty}
            >
              <Button>{t("title.addNewProperty")}</Button>
            </Link>
            {/* <Button variant={"outline"}>+ {t("button.bulkUpload")}</Button> */}
          </div>
        )}
      </div>
      {dataCompaniesProperties && (
        <PropertiesTable data={dataCompaniesProperties.results || []} />
      )}
    </>
  );
}
