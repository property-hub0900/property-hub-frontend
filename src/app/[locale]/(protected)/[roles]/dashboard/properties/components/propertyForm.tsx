"use client";

import { Loader } from "@/components/loader";
import { SimpleMultiSelect } from "@/components/multiSelect";
import { TiptapEditor, type TiptapEditorRef } from "@/components/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Switch } from "@/components/ui/switch";
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
import { COMPANY_PATHS } from "@/constants/paths";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRBAC } from "@/lib/hooks/useRBAC";
import { createPropertySchema } from "@/schema/protected/properties";
import { amenities } from "@/services/protected/properties";
import { TCreatePropertySchema } from "@/types/protected/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import PlacesAutocomplete from "../../../../../../../components/placesAutoComplete";
import { IFilesUrlPayload, TImages, UploadImages } from "./uploadImages";
import { PERMISSIONS } from "@/constants/rbac";


interface IPropertyFormProps<T> {
  mode: "create" | "edit";
  onSubmit: () => Promise<void> | void;
  defaultValues?: DefaultValues<T>;
}

export default function PropertyForm(
  props: IPropertyFormProps<TCreatePropertySchema>
) {
  const { mode, onSubmit, defaultValues } = props;

  const t = useTranslations();
  const router = useRouter();
  const { user } = useAuth();
  const { hasPermission } = useRBAC();

  const [filesUrls, setFilesUrls] = useState<IFilesUrlPayload>({ images: [] });

  const isOwner = user?.scope[0] === "owner";
  const isAdmin = user?.scope[0] === "admin";
  const isAgent = user?.scope[0] === "agent";

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
          status: PROPERTY_STATUSES.draft,
          furnishedType: "",
          occupancy: undefined,
          ownershipStatus: undefined,
          referenceNo: "",
          priceVisibilityFlag: false,
          propertySize: "",
          serviceCharges: "",
          buildingFloors: 0,
          floor: 0,
          tenure: "",
          views: "",
          address: "",
          amenities: [],
          description: "",
          PropertyImages: [],
        },
  });

  const category = form.watch("category");
  const propertyType = form.watch("propertyType");

  const handleCancel = () => {
    router.push(COMPANY_PATHS.properties);
  };

  const handleSubmitWithStatus = (status: TPropertyStatuses | string) => {
    const isFormValid = Object.keys(form.formState.errors).length === 0;
    const statusValue = PROPERTY_STATUSES[status];
    if (isFormValid) {
      form.setValue("PropertyImages", filesUrls.images, {
        shouldValidate: true,
      });
      form.setValue("status", statusValue);
    }

    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (filesUrls.images.length > 0) {
      form.setValue("PropertyImages", filesUrls.images, {
        shouldValidate: true,
      });
    }
  }, [filesUrls]);

  const initialImages: TImages[] = (defaultValues?.PropertyImages || []).filter(
    Boolean
  ) as TImages[];

  const editorRef = useRef<TiptapEditorRef>(null);

  return (
    <>
      <Loader isLoading={isLoadingAmenities}></Loader>
      <div className="container mx-auto">
        <Form {...form}>
          <form
            //onSubmit={form.handleSubmit(onSubmit)}
            onSubmit={(event) => event.preventDefault()}
            className="grid grid-cols-2 gap-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {t("form.title.label")}
                    <span>*</span>
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
              name="titleAr"
              render={({ field }) => (
                <FormItem className="col-span-2" dir="rtl">
                  <FormLabel>
                    عنوان<span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="PropertyImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.propertyImages.label")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <UploadImages
                        initialImages={initialImages}
                        setUploadedFilesUrls={setFilesUrls}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <UploadImages1
                setUploadedFilesUrls={setFilesUrls}
              ></UploadImages1> */}
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {t("form.propertyCategory.label")}
                    <span>*</span>
                  </FormLabel>
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
                  <FormLabel>
                    {t("form.propertyPurpose.label")}
                    <span>*</span>
                  </FormLabel>
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
                  <FormLabel>
                    {t("form.propertyType.label")}
                    <span>*</span>
                  </FormLabel>
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
                    <span>*</span>
                    <small className="text-muted-foreground">
                      ({t("text.sqft")})
                    </small>
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
                  <FormLabel>
                    {t("form.bathrooms.label")}
                    <span>*</span>
                  </FormLabel>
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
                      defaultValue={field.value ? field.value : ""}
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
                    defaultValue={field.value ? field.value : ""}
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
                    <FormLabel>
                      {t("form.price.label")}
                      <span>*</span>
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
                      {t("text.hidePriceFromListing")}
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
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {t("form.location.label")}
                    <span>*</span>
                  </FormLabel>
                  <FormControl>
                    {/* Pass field.onChange and field.value */}
                    <PlacesAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                    />
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
                  <FormLabel>
                    {t("form.amenities.label")}
                    <span>*</span>
                  </FormLabel>
                  <SimpleMultiSelect
                    defaultValue={field.value}
                    options={transformedAmenities || []}
                    onValueChange={(value) =>
                      field.onChange(value.map((v) => String(v)))
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referenceNo"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {t("form.referenceNo.label")}
                    <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {t("form.description.label")}
                    <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name={"description"}
              render={({ field }) => (
                <FormItem className="w-full col-span-2">
                  <FormLabel>
                    {t("form.description.label")}
                    <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <TiptapEditor
                      ref={editorRef}
                      content={field.value}
                      onChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  {/* {description && <FormDescription>{description}</FormDescription>} */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"descriptionAr"}
              render={({ field }) => (
                <FormItem className="col-span-2" dir="rtl">
                  <FormLabel>
                    وصف<span>*</span>
                  </FormLabel>
                  <FormControl>
                    <TiptapEditor
                      ref={editorRef}
                      content={field.value}
                      onChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  {/* {description && <FormDescription>{description}</FormDescription>} */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="descriptionAr"
              render={({ field }) => (
                <FormItem className="col-span-2" dir="rtl">
                  <FormLabel>
                    وصف<span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {hasPermission(PERMISSIONS.FEATURE_PROPERTY) && <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="col-span-2 flex justify-between items-center">
                  <FormLabel className="text-lg">
                    {t("text.wantToFeatureProperty")}
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />}
          </form>
        </Form>
      </div>
      <div className="col-span-2 gap-2 flex justify-end mt-6">
        {(!defaultValues || defaultValues?.status === PROPERTY_STATUSES.draft) && (
          <>
            <Button
              variant={"outline"}
              type="button"
              onClick={() => handleSubmitWithStatus(PROPERTY_STATUSES.draft)}
            >
              {t("button.saveDraft")}
            </Button>

            {(isOwner || isAdmin) && (
              <Button
                type="button"
                onClick={() => handleSubmitWithStatus(PROPERTY_STATUSES.published)}
              >
                {t("button.publish")}
              </Button>
            )}

            {isAgent && hasPermission(PERMISSIONS.CREATE_PROPERTY) && (
              <>
                {hasPermission(PERMISSIONS.PUBLISH_PROPERTY) ? (
                  <Button
                    type="button"
                    onClick={() => handleSubmitWithStatus(PROPERTY_STATUSES.published)}
                  >
                    {t("button.publish")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => handleSubmitWithStatus(PROPERTY_STATUSES.pending)}
                  >
                    {t("button.requestForApproval")}
                  </Button>
                )}
              </>
            )}
          </>
        )}

        {defaultValues?.status === PROPERTY_STATUSES.published && (
          <Button
            type="button"
            onClick={() => handleSubmitWithStatus(PROPERTY_STATUSES.closed)}
          >
            {t("button.close")}
          </Button>
        )}

        {defaultValues?.status && mode === "edit" && (
          <Button
            type="button"
            onClick={() => handleSubmitWithStatus(`${defaultValues?.status}`)}
          >
            {t("button.update")}
          </Button>
        )}

        <Button
          variant={"secondary"}
          type="button"
          onClick={handleCancel}
        >
          {t("button.cancel")}
        </Button>
      </div>
    </>
  );
}
