"use client";

import { Loader } from "@/components/loader";
import { adminServices } from "@/services/protected/admin";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import RenewalRequestsTable from "./components/table";

export default function Page() {
  const t = useTranslations();

  const { data: dataCustomers, isLoading } = useQuery({
    queryKey: ["adminSubscriptions"],
    queryFn: () => adminServices.getAdminSubscriptionsRenewalRequestsPending(),
  });

  return (
    <>
      <Loader variant="inline" isLoading={isLoading}></Loader>

      {dataCustomers?.results && (
        <RenewalRequestsTable data={dataCustomers.results || []} />
      )}
    </>
  );
}
