"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";

import { createPropertySchema } from "@/schema/dashboard/properties";
import { useQuery } from "@tanstack/react-query";

import { TCreatePropertySchema } from "@/types/dashboard/properties";

import { Loader } from "@/components/loader";
import { SimpleMultiSelect } from "@/components/multiSelect";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_FURNISHED_TYPE,
  PROPERTY_OCCUPANCY,
  PROPERTY_OWNERSHIP_STATUS,
  PROPERTY_PURPOSE,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  PROPERTY_VIEWS,
  TPropertyStatuses,
} from "@/constants/constants";
import { amenities } from "@/services/dashboard/properties";
import { Switch } from "@/components/ui/switch";
import { IFilesUrlPayload, UploadImages } from "./uploadImages";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { COMPANY_PATHS } from "@/constants/paths";

interface IPropertyFormProps<T> {
  mode: "create" | "edit";
  onSubmit: (values: T) => Promise<void> | void;
  defaultValues?: DefaultValues<T>;
}

export default function PropertyForm(
  props: IPropertyFormProps<TCreatePropertySchema>
) {
  const { mode, onSubmit, defaultValues } = props;

  const t = useTranslations();

  const router = useRouter();

  const { user } = useAuth();

  console.log("user", user?.scope[0]);

  const isOwner = user?.scope[0] === "owner";
  // const isAdmin = user?.scope[0] === "admin";
  // const isAgent = user?.scope[0] === "agent";

  console.log("defaultValues", defaultValues);

  const { data: amenitiesData, isLoading: isLoadingAmenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: amenities,
  });

  const transformedAmenities = amenitiesData?.results.map((item) => ({
    value: `${item.amenityId}`,
    label: item.name,
  }));

  const form = useForm<TCreatePropertySchema>({
    resolver: zodResolver(createPropertySchema(t)),
    defaultValues:
      mode === "edit"
        ? defaultValues
        : {
            title: "",
            titleAr: "",
            featured: false,
            category: undefined,
            price: 0,
            propertyType: "",
            purpose: undefined,
            bedrooms: 0,
            bathrooms: 0,
            // buildingFloors: "",
            // floorNumber: "",
            furnishedType: "",
            occupancy: "",
            ownershipStatus: "",
            //location: "",
            priceVisibilityFlag: false,
            propertySize: "",
            serviceCharges: "",
            tenure: "",
            views: "",
            amenities: [],
            description: "",
            //images: [{ isPrimary: false, url: "" }],
          },
  });

  const category = form.watch("category");
  const propertyType = form.watch("propertyType");

  const [filesUrls, setFilesUrls] = useState<IFilesUrlPayload>({ images: [] });

  const handleCancel = () => {
    router.push(COMPANY_PATHS.properties);
  };

  const handleSubmitWithStatus = (status: TPropertyStatuses) => {
    const statusValue = PROPERTY_STATUSES[status];

    form.setValue("status", statusValue);
    //form.handleSubmit(onSubmit)();

    form.handleSubmit(onSubmit)();
  };

  return (
    <>
      <Loader isLoading={isLoadingAmenities}></Loader>
      <div className="container mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            // onSubmit={(event) => event.preventDefault()}
            className="grid grid-cols-2 gap-6"
          >
            <div className="col-span-2">
              <UploadImages setUploadedFilesUrls={setFilesUrls} />
            </div>

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
              name="titleAr"
              render={({ field }) => (
                <FormItem className="col-span-2" dir="rtl">
                  <FormLabel>عنوان</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
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
                      {category && (
                        <>
                          {PROPERTY_TYPES?.[category]?.map((item, index) => (
                            <SelectItem key={index} value={item}>
                              {t(`form.propertyType.options.${item}`)}
                            </SelectItem>
                          ))}
                        </>
                      )}
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
            {category === "Residential" && (
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
            )}

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
              name="tenure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.tenureOfProperty.label")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownershipStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.ownershipStatus.label")}</FormLabel>
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
                      {PROPERTY_OWNERSHIP_STATUS.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {t(`form.ownershipStatus.options.${item}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {propertyType === "Apartment" && (
              <>
                <FormField
                  control={form.control}
                  name="buildingFloors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.buildingFloors.label")}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.floorNumber.label")}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="occupancy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.occupancy.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("form.occupancy.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_OCCUPANCY.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {t(`form.occupancy.options.${item}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {category === "Residential" && (
              <FormField
                control={form.control}
                name="furnishedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.furnishedType.label")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.furnishedType.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_FURNISHED_TYPE.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {t(`form.furnishedType.options.${item}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="views"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.views.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("form.views.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_VIEWS.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {t(`form.views.options.${item}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
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
                name="priceVisibilityFlag"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="priceVisibilityFlag"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="priceVisibilityFlag"
                      className="text-sm font-normal cursor-pointer select-none text-muted-foreground"
                    >
                      Hide price from the listing
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="serviceCharges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.serviceCharges.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
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
            /> */}
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("form.amenities.label")}</FormLabel>
                  <SimpleMultiSelect
                    defaultValue={["4"]}
                    options={transformedAmenities || []}
                    onValueChange={(value) =>
                      field.onChange(value.map((v) => Number(v)))
                    }
                  />
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
              name="descriptionAr"
              render={({ field }) => (
                <FormItem className="col-span-2" dir="rtl">
                  <FormLabel>وصف</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="col-span-2 flex justify-between items-center">
                  <FormLabel className="text-lg">
                    Want to feature this property?
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="col-span-2 gap-2 flex justify-end mt-6">
        <Button
          variant={"outline"}
          type="button"
          onClick={() => handleSubmitWithStatus(PROPERTY_STATUSES.draft)}
          className=""
        >
          {t("button.saveDraft")}
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmitWithStatus(PROPERTY_STATUSES.published)}
          className=""
        >
          {t("button.publish")}
        </Button>
        <Button
          variant={"secondary"}
          type="button"
          onClick={handleCancel}
          className=""
        >
          {t("button.cancel")}
        </Button>
      </div>
    </>
  );
}
