"use client";

import { Loader } from "@/components/loader";
import { adminServices } from "@/services/protected/admin";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import SubscriptionPlansTable from "./components/table";

export default function Page() {
  const t = useTranslations();

  const { data: dataCustomers, isLoading } = useQuery({
    queryKey: ["adminSubscriptions"],
    queryFn: () => adminServices.getAdminSubscriptionsPlansApproved(),
  });

  return (
    <>
      <Loader variant="inline" isLoading={isLoading}></Loader>
      {/* <div className="flex justify-between items-center mb-5">
        <h3>{t("sidebar.subscriptionPlans")}</h3>
      </div> */}

      {dataCustomers?.results && (
        <SubscriptionPlansTable data={dataCustomers.results || []} />
      )}
    </>
  );
}
