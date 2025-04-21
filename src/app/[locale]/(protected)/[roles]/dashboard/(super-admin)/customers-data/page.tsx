"use client";

import { Input } from "@/components/ui/input";
import CustomersDataTable, {
  ICustomersData,
} from "./components/customers-table";

//import { Loader } from "@/components/loader";
import { useAuth } from "@/lib/hooks/useAuth";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export const customersData: ICustomersData = {
  results: [
    {
      name: "Akbar Ali",
      email: "akbar.ali@example.com",
      phoneNumber: "+92-300-1234567",
      createdAt: "2025-04-10T09:15:00Z",
      status: "active",
    },
    {
      name: "Sarah Khan",
      email: "sarah.k@example.com",
      phoneNumber: "+92-333-9876543",
      createdAt: "2025-03-22T14:30:00Z",
      status: "pending",
    },
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "+92-301-7654321",
      createdAt: "2025-02-18T10:00:00Z",
      status: "inactive",
    },
  ],
};

export default function Page() {
  const { user } = useAuth();
  const t = useTranslations();

  // const {
  //   data: dataSaveSearches,
  //   isLoading,
  //   isFetching,
  // } = useQuery({
  //   queryKey: ["savedSearches", user?.userId],
  //   queryFn: () => getSaveSearched(Number(user?.userId)),
  //   enabled: !!user?.userId,
  // });

  return (
    <>
      {/* <Loader variant="inline" isLoading={isLoading || isFetching}></Loader> */}
      <div className="flex justify-between items-center mb-5">
        <h3>{t("sidebar.customersData")}</h3>
      </div>

      {customersData.results && (
        <CustomersDataTable data={customersData.results || []} />
      )}
    </>
  );
}
