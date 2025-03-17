"use client";

import type React from "react";
import { useTranslations } from "next-intl";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { TCreatePropertySchema } from "@/types/dashboard/properties";

import {
  createProperty,
  getPropertyById,
  updatePropertyById,
} from "@/services/dashboard/properties";
import { Loader } from "@/components/loader";
import { COMPANY_PATHS } from "@/constants/paths";
import PropertyForm from "../propertyForm";

export default function EditPropertyPage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = params;

  const t = useTranslations();
  const router = useRouter();

  const { data: getPropertyByIdData } = useQuery({
    queryKey: ["getPropertyById", id],
    queryFn: () => getPropertyById(id),
  });

  const updatePropertyByIdMutation = useMutation({
    mutationKey: ["updatePropertyById"],
    mutationFn: updatePropertyById,
  });

  async function onSubmit(values: TCreatePropertySchema) {
    console.log("updatePropertyByIdMutation values", values);

    try {
      await updatePropertyByIdMutation.mutateAsync(values);
      toast.success(t("form.success"));

      //router.push(COMPANY_PATHS.properties);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <>
      <Loader isLoading={updatePropertyByIdMutation.isPending}></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>Edit Property</h3>
      </div>
      <div className="bg-white rounded-md shadow">
        <div className="p-6">
          {getPropertyByIdData && (
            <PropertyForm
              mode="create"
              onSubmit={onSubmit}
              //defaultValues={getPropertyByIdData}
            ></PropertyForm>
          )}
        </div>
      </div>
    </>
  );
}
