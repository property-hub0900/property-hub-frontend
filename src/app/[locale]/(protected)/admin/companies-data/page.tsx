"use client";

import { Loader } from "@/components/loader";
import { adminServices } from "@/services/protected/admin";
import { useQuery } from "@tanstack/react-query";
import CompaniesDataTable from "./components/table";
import { useTranslations } from "next-intl";

export default function Page() {

  const {
    data: dataList,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["adminCompanies"],
    queryFn: () => adminServices.adminCompanies(),
  });

  return (
    <>
      <Loader variant="inline" isLoading={isLoading || isFetching}></Loader>
      {dataList?.results && (
        <CompaniesDataTable data={dataList.results || []} />
      )}
    </>
  );
}
