"use client";

import { Loader } from "@/components/loader";
import { adminServices } from "@/services/protected/admin";
import { useQuery } from "@tanstack/react-query";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { EditForm } from "../components/edit-form";

export default function Page() {
  const { id } = useParams();

  const t = useTranslations();

  const {
    data: companyData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getAdminCompany", id],
    queryFn: () => adminServices.getAdminCompany(Number(id)),
  });

  return (
    <>
      <Loader variant="inline" isLoading={isLoading || isFetching}></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>{t("sidebar.companiesData")}</h3>
      </div>
      {companyData && <EditForm companyData={companyData}></EditForm>}
    </>
  );
}
