"use client";

import type React from "react";
import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/utils";
import { TCreatePropertySchema } from "@/types/dashboard/properties";

import { useParams } from "next/navigation";

import {
  getPropertyById,
  updatePropertyById,
} from "@/services/dashboard/properties";
import { Loader } from "@/components/loader";
import { COMPANY_PATHS } from "@/constants/paths";
import PropertyForm from "../components/propertyForm";
//import { PropertyForm } from "../components/property-form";

export default function EditPropertyPage() {
  const params = useParams();

  const id = params?.id ?? "0";



  const t = useTranslations();
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: getPropertyByIdData } = useQuery({
    queryKey: ["getPropertyById", id],
    queryFn: () => getPropertyById(String(id)),
    enabled: id !== "0",
  });

  const updatePropertyByIdMutation = useMutation({
    mutationKey: ["updatePropertyById"],
    mutationFn: updatePropertyById,
  });

  async function onSubmit(values: TCreatePropertySchema) {
    const updatedObj = { id: String(id), payload: values };
    try {
      const response = await updatePropertyByIdMutation.mutateAsync(updatedObj);
      queryClient.invalidateQueries({
        queryKey: ["companiesProperties"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getPropertyById", id],
      });
      router.push(COMPANY_PATHS.properties);
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <>
      <Loader isLoading={updatePropertyByIdMutation.isPending}></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>{t("title.editProperty")}</h3>
      </div>
      <div className="bg-white rounded-md shadow">
        <div className="p-6">
          {getPropertyByIdData && (
            <>
              {/* <PropertyForm
                onSubmit={onSubmit as any}
                initialImages={getPropertyByIdData.PropertyImages}
              ></PropertyForm> */}

              <PropertyForm
                mode="edit"
                onSubmit={onSubmit as any}
                defaultValues={getPropertyByIdData}
              ></PropertyForm>
            </>
          )}
        </div>
      </div>
    </>
  );
}
