"use client";

import { Loader } from "@/components/loader";
import { useAuth } from "@/lib/hooks/useAuth";
import { adminServices } from "@/services/protected/admin";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import CustomersDataTable from "./components/table";

export default function Page() {
  const { user } = useAuth();
  const t = useTranslations();

  const { data: dataCustomers, isLoading } = useQuery({
    queryKey: ["adminCustomers"],
    queryFn: () => adminServices.adminCustomers(),
    enabled: !!user?.userId,
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
