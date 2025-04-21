"use client";

import CompaniesDataTable, { ICustomersData } from "./components/table";

//import { Loader } from "@/components/loader";
import { useAuth } from "@/lib/hooks/useAuth";

import { useTranslations } from "next-intl";

export const customersData: ICustomersData = {
  results: [
    {
      id: 1,
      name: "Akbar Ali",
      email: "akbar.ali@example.com",
      phoneNumber: "+92-300-1234567",
      listingsCount: 10,
      points: 100,
      leads: 20,
      createdAt: "2025-04-10T09:15:00Z",
      status: "active",
    },
    {
      id: 2,
      name: "Akbar Ali",
      email: "akbar.ali@example.com",
      phoneNumber: "+92-300-1234567",
      listingsCount: 10,
      points: 100,
      leads: 20,
      createdAt: "2025-04-10T09:15:00Z",
      status: "active",
    },
    {
      id: 3,
      name: "Akbar Ali",
      email: "akbar.ali@example.com",
      phoneNumber: "+92-300-1234567",
      listingsCount: 10,
      points: 100,
      leads: 20,
      createdAt: "2025-04-10T09:15:00Z",
      status: "active",
    },
    {
      id: 4,
      name: "Akbar Ali",
      email: "akbar.ali@example.com",
      phoneNumber: "+92-300-1234567",
      listingsCount: 10,
      points: 100,
      leads: 20,
      createdAt: "2025-04-10T09:15:00Z",
      status: "active",
    },
    {
      id: 5,
      name: "Akbar Ali",
      email: "akbar.ali@example.com",
      phoneNumber: "+92-300-1234567",
      listingsCount: 10,
      points: 100,
      leads: 20,
      createdAt: "2025-04-10T09:15:00Z",
      status: "active",
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
        <h3>{t("sidebar.companiesData")}</h3>
      </div>

      {customersData.results && (
        <CompaniesDataTable data={customersData.results || []} />
      )}
    </>
  );
}
