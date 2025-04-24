"use client";

import { Loader } from "@/components/loader";
import { COMPANY_PATHS } from "@/constants/paths";
import { createProperty } from "@/services/protected/properties";
import { TCreatePropertySchema } from "@/types/protected/properties";
import { getErrorMessage } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PropertyForm from "../components/propertyForm";

export default function CreatePropertyPage() {
  const t = useTranslations();
  const router = useRouter();

  const createPropertyMutation = useMutation({
    mutationKey: ["createProperty"],
    mutationFn: createProperty,
  });

  async function onSubmit(values: TCreatePropertySchema) {
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
