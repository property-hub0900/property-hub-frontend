"use client";

import { useTranslations } from "next-intl";
import { Charts } from "./components/charts";
import { Stats } from "./components/stats";
import { useQuery } from "@tanstack/react-query";
import { adminServices } from "@/services/protected/admin";
import CompaniesDataTable from "./components/table";
import { Loader } from "@/components/loader";
import { useState } from "react";

export default function Dashboard() {
  const t = useTranslations();

  const [companyTimeframe, setCompanyTimeframe] = useState<string>("weekly");
  const [propertyTimeframe, setPropertyTimeframe] = useState<string>("monthly");

  const {
    data: dataList,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["adminCompanies"],
    queryFn: () => adminServices.adminCompanies("inactive"),
  });

  const {
    data: dataAdminCompaniesReport,
    isLoading: isLoadingAdminCompaniesReport,
  } = useQuery({
    queryKey: ["adminCompaniesReport", companyTimeframe],
    queryFn: () => adminServices.getAdminCompaniesReport(companyTimeframe),
  });

  const {
    data: dataAdminPropertiesReport,
    isLoading: isLoadingAdminPropertiesReport,
  } = useQuery({
    queryKey: ["adminPropertiesReport", propertyTimeframe],
    queryFn: () => adminServices.getAdminPropertiesReport(propertyTimeframe),
  });

  const { data: dataAdminStatsReport, isLoading: isLoadingAdminStatsReport } =
    useQuery({
      queryKey: ["adminStatsReport"],
      queryFn: () => adminServices.getAdminStatsReport(),
    });

  return (
    <>
      <Loader
        variant="inline"
        isLoading={
          isLoading ||
          isFetching ||
          isLoadingAdminStatsReport ||
          isLoadingAdminCompaniesReport ||
          isLoadingAdminPropertiesReport
        }
      ></Loader>

      <div className="flex flex-col gap-6">
        <h4 className="">{t("title.dashboard")}</h4>

        {dataAdminStatsReport && <Stats data={dataAdminStatsReport.data} />}

        {dataAdminCompaniesReport?.results &&
          dataAdminPropertiesReport?.results && (
            <Charts
              companyTimeframe={companyTimeframe}
              setCompanyTimeframe={setCompanyTimeframe}
              companiesData={dataAdminCompaniesReport?.results}
              propertyTimeframe={propertyTimeframe}
              setPropertyTimeframe={setPropertyTimeframe}
              propertiesData={dataAdminPropertiesReport?.results}
            />
          )}

        {dataList?.results && (
          <CompaniesDataTable data={dataList?.results || []} />
        )}
      </div>
    </>
  );
}
