"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { COMPANY_PATHS } from "@/constants/paths";

import MyPropertiesTable from "./components/myPropertiesTable";
import AgentPropertiesTable from "./components/agentPropertiesTable";
import { useQuery } from "@tanstack/react-query";
import { companiesProperties } from "@/services/dashboard/properties";
import { Loader } from "@/components/loader";

export default function PropertiesListing() {
  const {
    data: dataCompaniesProperties,
    isLoading: isLoadingProperties,
    isFetching: isFetchingProperties,
  } = useQuery({
    queryKey: ["companiesPropertiesSelf"],
    queryFn: () => companiesProperties("self"),
  });

  const {
    data: dataAgentProperties,
    isLoading: isLoadingAgentProperties,
    isFetching: isFetchingAgentProperties,
  } = useQuery({
    queryKey: ["companiesPropertiesAgent"],
    queryFn: () => companiesProperties("agent"),
  });

  return (
    <>
      <Loader
        variant="inline"
        isLoading={
          isLoadingProperties ||
          isFetchingProperties ||
          isLoadingAgentProperties ||
          isFetchingAgentProperties
        }
      ></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>Property Data</h3>
        <Link className="cursor-pointer" href={COMPANY_PATHS.addNewProperty}>
          <Button>+Add New Property</Button>
        </Link>
      </div>
      {dataCompaniesProperties && (
        <MyPropertiesTable {...dataCompaniesProperties} />
      )}
      {dataAgentProperties && <AgentPropertiesTable {...dataAgentProperties} />}
    </>
  );
}
