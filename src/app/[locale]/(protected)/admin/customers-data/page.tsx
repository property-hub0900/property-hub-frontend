"use client";

import { Loader } from "@/components/loader";
import { adminServices } from "@/services/protected/admin";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import CustomersDataTable from "./components/table";

export default function Page() {
  const t = useTranslations();

  const { data: dataCustomers, isLoading } = useQuery({
    queryKey: ["adminCustomers"],
    queryFn: () => adminServices.adminCustomers(),
  });

  return (
    <>
      <Loader variant="inline" isLoading={isLoading}></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>{t("sidebar.customersData")}</h3>
      </div>

      {dataCustomers?.results && (
        <CustomersDataTable data={dataCustomers.results || []} />
      )}
    </>
  );
}
