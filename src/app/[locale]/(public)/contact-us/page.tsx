"use client";

import { Loader } from "@/components/loader";
import PlacesAutocomplete from "@/components/placesAutoComplete";
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
import { Textarea } from "@/components/ui/textarea";
import { PROPERTY_PURPOSE, PROPERTY_TYPES } from "@/constants/constants";
import { contactUsSchema, TContactUsSchema } from "@/schema/public";
import { authService } from "@/services/public/auth";
import { getErrorMessage } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function page() {
  const t = useTranslations("");
  const schema = contactUsSchema(t);

  const form = useForm<TContactUsSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      purpose: "",
      propertyType: "",
      locationPreference: "",
      budget: "",
      message: "",
    },
    //mode: "onChange",
  });

  const contactUsMutation = useMutation({
    mutationKey: ["contactUs"],
    mutationFn: authService.contactUs,
  });

  const onSubmit = async (values: TContactUsSchema) => {
    try {
      const response = await contactUsMutation.mutateAsync(values);
      toast.success(response.message);
      form.reset();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="container mx-auto my-8 md:my-14">
      <Loader isLoading={contactUsMutation.isPending}></Loader>

      <div className="bg-card text-card-foreground shadow-lg max-w-full p-5 md:px-32 md:py-10 space-y-5">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h2>{t("title.contactUsTitle")}</h2>
          <p className="text-sm text-muted-foreground w-full lg:w-3/4 mx-auto">
            {t("text.contactUsSubText")}
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.firstName.label")} <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.firstName.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.lastName.label")} <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.lastName.placeholder")}
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
                    {t("form.email.label")} <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("form.email.placeholder")}
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
                      type="tel"
                      placeholder={t("form.phoneNumber.label")}
                      {...field}
                    />
                  </FormControl>
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
                      <>
                        {PROPERTY_TYPES?.Residential?.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {t(`form.propertyType.options.${item}`)}
                          </SelectItem>
                        ))}
                        {PROPERTY_TYPES?.Commercial?.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {t(`form.propertyType.options.${item}`)}
                          </SelectItem>
                        ))}
                      </>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationPreference"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>
                    {t("form.locationPreference.label")}
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
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.budget.label")} <span>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("form.budget.label")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.additionalInformation.label")} <span>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.additionalInformation.label")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2 flex justify-center">
              <Button type="submit" className="">
                {t("button.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
