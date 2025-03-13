"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { createPropertySchema } from "@/schema/dashboard/properties";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { TCreatePropertySchema } from "@/types/dashboard/properties";

import { SimpleMultiSelect } from "@/components/multiSelect";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_PURPOSE,
  PROPERTY_TYPES,
} from "@/constants/constants";

export default function CreatePropertyPage() {
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<TCreatePropertySchema>({
    resolver: zodResolver(createPropertySchema(t)),
    defaultValues: {
      title: "",
      featured: false,
      description: "",
      price: 0,
      propertyType: "",
      purpose: undefined,
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
      //images: [{ isPrimary: false, url: "" }],
    },
  });

  const createPropertyMutation = useMutation({
    mutationKey: ["createProperty"],
    mutationFn: async (values: TCreatePropertySchema) => {
      // API call to create property
    },
  });

  async function onSubmit(values: TCreatePropertySchema) {
    try {
      await createPropertyMutation.mutateAsync(values);
      toast.success(t("form.success"));
      router.push("/properties");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6"
          >
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.featured.label")}</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("form.title.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyCategory"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("form.propertyCategory.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("form.propertyCategory.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_CATEGORIES.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {t(`form.propertyCategory.options.${item}`)}
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
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.propertyPurpose.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("form.propertyPurpose.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_PURPOSE.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {t(`form.propertyPurpose.options.${item}`)}
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
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.propertyType.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("form.propertyType.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((item, index) => (
                        <SelectItem key={index} value={item}>
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
              name="propertySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.propertySize.label")}
                    <span className="text-muted-foreground"> (Sqft)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.bedrooms.label")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.bathrooms.label")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="furnishedType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.furnishedType.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("form.furnishedType.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2000">2000</SelectItem>
                      <SelectItem value="2001">2001</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.price.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buildYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.buildYear.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("form.buildYear.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2000">2000</SelectItem>
                      <SelectItem value="2001">2001</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("form.location.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("form.description.label")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("form.amenities.label")}</FormLabel>
                  <SimpleMultiSelect
                    //defaultValue={field.value?.map((v) => String(v))}
                    options={[
                      { label: "hello", value: "1" },
                      { label: "hello2", value: "2" },
                    ]}
                    onValueChange={(value) =>
                      field.onChange(value.map((v) => Number(v)))
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={createPropertyMutation.isPending}
              type="submit"
              className="col-span-2"
            >
              {t("button.submit")}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
