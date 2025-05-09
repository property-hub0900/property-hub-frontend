"use client";

import { RoleGate } from "@/components/rbac/role-gate";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PROPERTY_STATUSES, PROPERTY_TYPES } from "@/constants/constants";
import { USER_ROLES, UserRole } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";
import {
  propertyDataFIltersSchema,
  TPropertyDataFIltersSchema,
} from "@/schema/protected/properties";
import { staffList } from "@/services/protected/properties";
import { IOption } from "@/types/common";
import { IPropertyDataFilters } from "@/types/protected/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const initFilters = {
  title: "",
  referenceNo: "",
  companyName: "",
  publisher: "",
  featured: "",
  propertyType: "",
  status: "",
};

export const MoreFiltersDialog = ({
  filters,
  handleFilters,
}: {
  filters: IPropertyDataFilters;
  handleFilters: (filters: IPropertyDataFilters) => void;
}) => {
  const t = useTranslations();

  const [mappedStaffList, setMappedStaffList] = useState<IOption[]>([]);

  const schema = useMemo(() => propertyDataFIltersSchema(t), [t]);

  const { currentRole } = useRBAC();

  const staffAllowedRoles: UserRole[] = [USER_ROLES.OWNER, USER_ROLES.MANAGER];

  const { data: staffListData } = useQuery({
    queryKey: ["staffList"],
    queryFn: staffList,
    enabled: staffAllowedRoles.includes(currentRole),
  });

  useEffect(() => {
    if (staffListData?.results && staffListData?.results.length > 0) {
      const staffListOptions = staffListData.results.map((item) => ({
        label: `${item.firstName} ${item.lastName}`,
        value: `${item.staffId}`,
      }));
      setMappedStaffList(staffListOptions);
    }
  }, [staffListData]);

  const form = useForm<TPropertyDataFIltersSchema>({
    resolver: zodResolver(schema),
    defaultValues: filters,
  });

  async function onSubmit(data: TPropertyDataFIltersSchema) {
    handleFilters(data);
  }

  const handleReset = () => {
    handleFilters(initFilters);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10" type="button">
          <SlidersHorizontal className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] w-6xl">
        <DialogHeader>
          <DialogTitle>{t("button.moreFilters")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <RoleGate allowedRoles={[USER_ROLES.ADMIN]}>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        {...field}
                        placeholder={t("form.companyName.label")}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </RoleGate>

              <RoleGate allowedRoles={staffAllowedRoles}>
                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={"publisher"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"publisher"}>
                            {t("form.publisher.label")}
                          </SelectItem>
                          <>
                            {mappedStaffList.map((item) => (
                              <SelectItem
                                key={`staff-${item.value}`}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </RoleGate>

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.featuredStatus.label")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"featuredStatus"}>
                          {t("form.featuredStatus.label")}
                        </SelectItem>
                        <SelectItem value={"featured"}>
                          {t("form.featuredStatus.options.featured")}
                        </SelectItem>
                        <SelectItem value={"Standard"}>
                          {t("form.featuredStatus.options.standard")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.propertyType.label")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t("form.propertyType.label")}>
                          {t("form.propertyType.label")}
                        </SelectItem>
                        {PROPERTY_TYPES?.Residential?.map((item, index) => (
                          <SelectItem key={`residential-${index}`} value={item}>
                            {t(`form.propertyType.options.${item}`)}
                          </SelectItem>
                        ))}
                        {PROPERTY_TYPES?.Commercial?.map((item, index) => (
                          <SelectItem key={`residential-${index}`} value={item}>
                            {t(`form.propertyType.options.${item}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="capitalize">
                        <SelectValue
                          className="capitalize"
                          placeholder={t("form.propertyStatuses.label")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t("form.propertyStatuses.label")}>
                          {t("form.propertyStatuses.label")}
                        </SelectItem>
                        {Object.entries(PROPERTY_STATUSES)?.map(
                          ([key, value]) => (
                            <SelectItem
                              className="capitalize"
                              key={`status-${value}`}
                              value={value}
                            >
                              {t(`form.propertyStatuses.options.${key}`)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 flex gap-2 justify-end">
                <DialogClose asChild>
                  <Button
                    onClick={handleReset}
                    variant={"outline"}
                    type="button"
                  >
                    {t("button.reset")}
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit">{t("button.search")}</Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
