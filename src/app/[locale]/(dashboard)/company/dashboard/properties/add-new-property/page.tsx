"use client";

import { useTranslations } from "next-intl";

import { getErrorMessage } from "@/utils/utils";
import { TCreatePropertySchema } from "@/types/dashboard/properties";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Loader } from "@/components/loader";
import { createProperty } from "@/services/dashboard/properties";
import PropertyForm from "../components/propertyForm";
import { COMPANY_PATHS } from "@/constants/paths";

export default function CreatePropertyPage() {
  const t = useTranslations();
  const router = useRouter();

  const createPropertyMutation = useMutation({
    mutationKey: ["createProperty"],
    mutationFn: createProperty,
  });

  async function onSubmit(values: TCreatePropertySchema) {
    console.log("values", values);

    try {
      const response = await createPropertyMutation.mutateAsync(values);
      toast.success(response.message);
      router.push(COMPANY_PATHS.properties);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <>
      <Loader isLoading={createPropertyMutation.isPending}></Loader>
      <div className="flex justify-between items-center mb-5">
        <h3>{t("title.addNewProperty")}</h3>
      </div>
      <div className="bg-white rounded-md shadow">
        <div className="p-6">
          <PropertyForm mode="create" onSubmit={onSubmit as any}></PropertyForm>
        </div>
      </div>
    </>
  );
}
