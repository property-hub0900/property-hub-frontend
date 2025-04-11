"use client";

import SavedSearchesTable from "./components/components/saved-searches-table";

import { Loader } from "@/components/loader";
import { useAuth } from "@/lib/hooks/useAuth";

import { customerServices } from "@/services/protected/properties";

import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { user } = useAuth();

  const {
    data: dataSaveSearches,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["savedSearches", user?.userId],
    queryFn: () => customerServices.getSaveSearched(Number(user?.userId)),
    enabled: !!user?.userId,
  });

  return (
    <>
      <Loader variant="inline" isLoading={isLoading || isFetching}></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>Saved Properties</h3>
      </div>

      {dataSaveSearches && <SavedSearchesTable {...dataSaveSearches} />}
    </>
  );
}
