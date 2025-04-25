"use client";

import { Loader } from "@/components/loader";
import { adminServices } from "@/services/protected/admin";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import TopUpsTable from "./components/table";

export default function Page() {
  const t = useTranslations();

  const { data: dataList, isLoading } = useQuery({
    queryKey: ["getAdminPoints"],
    queryFn: () => adminServices.getAdminPoints(),
  });

  return (
    <>
      <Loader variant="inline" isLoading={isLoading}></Loader>

      {dataList?.results && <TopUpsTable data={dataList.results || []} />}
    </>
  );
}
