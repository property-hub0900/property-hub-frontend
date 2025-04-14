"use client";

import SavedSearchesTable from "./components/components/saved-searches-table";

import { Loader } from "@/components/loader";
import { useAuth } from "@/lib/hooks/useAuth";

import { customerService } from "@/services/protected/customer";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function Page() {
  const { user } = useAuth();
  const t = useTranslations();

  const {
    data: dataSaveSearches,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["savedSearches", user?.userId],
    queryFn: () => customerService.getSaveSearched(Number(user?.userId)),
    enabled: !!user?.userId,
  });

  return (
    <>
      <Loader variant="inline" isLoading={isLoading || isFetching}></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>{t("sidebar.savedSearches")}</h3>
      </div>

      {dataSaveSearches && <SavedSearchesTable {...dataSaveSearches} />}
    </>
  );
}
