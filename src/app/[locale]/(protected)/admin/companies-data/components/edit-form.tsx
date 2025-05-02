"use client";

import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ADMIN_PATHS } from "@/constants/paths";
import {
  adminCompanySchema,
  TAdminCompanySchema,
} from "@/schema/protected/properties";
import { adminServices } from "@/services/protected/admin";
import { IEditCompanyGet } from "@/types/protected/admin";
import { getErrorMessage } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AddPointsDialogue } from "./add-points-dialogue";
import { useState } from "react";

import * as React from "react";

import { DatePicker } from "@/components/datepicker";

export const EditForm = ({ companyData }: { companyData: IEditCompanyGet }) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [isAddPointsDialogOpen, setIsAddPointsDialogOpen] = useState(false);

  const updateAdminCompanyMutation = useMutation({
    mutationKey: ["updateAdminCompany"],
    mutationFn: adminServices.updateAdminCompany,
  });

  const form = useForm<TAdminCompanySchema>({
    resolver: zodResolver(adminCompanySchema(t)),
    defaultValues: {
      name: companyData.name,
      email: companyData.email,
      phone: companyData.phone || "",
      website: companyData.website || "",
      status: companyData.status,
      city: companyData.city || "",
      state: companyData.state || "",
      street: companyData.street || "",
      postalCode: companyData.postalCode || "",
      contractExpiryDate: companyData.CompanyContract?.contractExpiryDate
        ? new Date(companyData.CompanyContract?.contractExpiryDate)
        : undefined,
      pointsPerDuration:
        companyData.CompanyContract?.pointsPerDuration || undefined,
      pricePerDuration:
        companyData.CompanyContract?.pricePerDuration || undefined,
    },
  });

  const onSubmit = async (data: TAdminCompanySchema) => {
    try {
      const payloads = {
        companyId: companyData.companyId,
        data: data,
      };

      const response = await updateAdminCompanyMutation.mutateAsync(payloads);
      queryClient.invalidateQueries({
        queryKey: ["adminCompanies"],
      });
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Loader isLoading={updateAdminCompanyMutation.isPending} />
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 bg-white rounded-md border mb-10 p-5 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.companyName.label")} <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.companyName.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.companyEmail.label")} <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.companyEmail.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.phoneNumber.label")} <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.phoneNumber.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.websiteUrl.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.websiteUrl.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.status.label")} <span>*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("form.ownershipStatus.placeholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"active"}>
                            {t("form.status.options.active")}
                          </SelectItem>
                          <SelectItem value={"inactive"}>
                            {t("form.status.options.inactive")}
                          </SelectItem>
                          <SelectItem value={"rejected"}>
                            {t("form.status.options.reject")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <Separator />
                </div>

                <h5 className=" col-span-2">{t(`title.businessAddress`)}</h5>

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.streetAddress.label")} <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.streetAddress.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.city.label")} <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t("form.city.label")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.stateProvince.label")} <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.stateProvince.label")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.postalCode.label")} <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.postalCode.label")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <Separator />
                </div>

                <h5 className=" col-span-2">
                  {t(`title.subscriptionDetails`)}
                </h5>

                <DatePicker
                  name="contractExpiryDate"
                  label={t("form.contractExpiry.label")}
                  disabledDate={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />

                <div className=""></div>

                <FormField
                  control={form.control}
                  name="pointsPerDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.points.label")} <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.points.label")}
                          {...field}
                          value={field.value ? field.value : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.price.label")} <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.price.label")}
                          {...field}
                          value={field.value ? field.value : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <Separator />
                </div>

                <h5 className=" col-span-2">{t(`title.pointsDetails`)}</h5>

                <div>
                  <FormItem>
                    <FormLabel>{t(`form.currentPoints.label`)}</FormLabel>
                    <FormControl>
                      <Input disabled value={companyData.sharedPoints || ""} />
                    </FormControl>
                  </FormItem>
                </div>
                <div>
                  <Button
                    size={"sm"}
                    className="h-10 mt-5"
                    type="button"
                    onClick={() => setIsAddPointsDialogOpen(true)}
                  >
                    {t("button.addPoints")}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`${ADMIN_PATHS.companiesData}`}>
                <Button type="button" variant={"secondary"}>
                  {t("button.cancel")}
                </Button>
              </Link>
              <Button type="submit">{t("button.save")}</Button>
            </div>
          </form>
        </Form>
        <AddPointsDialogue
          companyId={companyData.companyId}
          isAddPointsDialogOpen={isAddPointsDialogOpen}
          setIsAddPointsDialogOpen={setIsAddPointsDialogOpen}
        />
      </div>
    </>
  );
};
