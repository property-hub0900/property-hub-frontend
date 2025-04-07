"use client";

import type React from "react";

import { useState, forwardRef, useImperativeHandle } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companyService } from "@/services/company";
import { Loader } from "@/components/loader";
import { getErrorMessage } from "@/utils/utils";
import { uploadImageToFirebase } from "@/lib/firebaseUtil";
import { UserAvatar } from "../ui/user-avatar";

const companySettingsSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().optional(),
  phone: z.string().optional(),
  taxNumber: z.string().optional(),
  logo: z.any().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>;

interface CompanySettingsFormProps {
  userData: any;
}

export const CompanySettingsForm = forwardRef<any, CompanySettingsFormProps>(
  ({ userData }, ref) => {
    const t = useTranslations();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [companyLogo, setCompanyLogo] = useState<string | null>(
      userData.company?.logo || null
    );
    const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);

    let company: any = userData.company || {};

    const form = useForm<CompanySettingsFormValues>({
      resolver: zodResolver(companySettingsSchema),
      defaultValues: {
        name: company.name || "",
        email: company.email || "",
        website: company.website || "",
        phone: company.phone || "",
        taxNumber: company.taxNumber || "",
        logo: company.logo || "",
        street: company.street || "",
        city: company.city || "",
        state: company.state || "",
        country: company.country || "",
        postalCode: company.postalCode || "",
      },
    });

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      submit: async () => {
        return form.handleSubmit(onSubmit)();
      },
      reset: () => {
        form.reset();
        setCompanyLogo(company.logo || null);
        setCompanyLogoFile(null);
      },
    }));

    const onSubmit = async (data: CompanySettingsFormValues) => {
      try {
        setIsSubmitting(true);

        // Upload company logo if a new one was selected
        if (companyLogoFile) {
          setIsUploading(true);
          try {
            const downloadURL = await uploadImageToFirebase(companyLogoFile);
            data.logo = downloadURL;
            setCompanyLogo(downloadURL);
          } catch (error) {
            console.error("Failed to upload company logo:", error);
            toast.error("Failed to upload company logo");
            setIsUploading(false);
            setIsSubmitting(false);
            return;
          } finally {
            setIsUploading(false);
          }
        } else if (companyLogo === null) {
          // If logo was removed
          data.logo = null;
        }

        const response = await companyService.updateCompany({
          ...data,
        });

        toast.success(
          response.message || "Company details updated successfully"
        );

        // Reset the file state after successful upload
        setCompanyLogoFile(null);
        return response;
      } catch (error) {
        console.error("Failed to update company details:", error);
        toast.error(getErrorMessage(error));
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    };

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Handles company logo upload.
     * @param e Input change event.
     */
    /******  6a147046-291d-4f49-82c1-acad2758c8a3  *******/
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Store the file for later upload
        setCompanyLogoFile(file);

        // Create a temporary local URL for preview
        const logoUrl = URL.createObjectURL(file);
        setCompanyLogo(logoUrl);
      }
    };

    const handleRemoveLogo = () => {
      setCompanyLogo(null);
      setCompanyLogoFile(null);
      company = {
        ...company,
        logo: null,
      };
      form.setValue("logo", "", { shouldDirty: true });
    };

    return (
      <div className="p-14">
        <Loader isLoading={isSubmitting || isUploading} />

        <div className="flex items-center gap-6 mb-8 ">
          <div className="relative">
            <UserAvatar
              src={companyLogo || company.logo || "placeholder.svg"}
              firstName={company.name}
              lastName={company.name}
              size="xl"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold">{company.name}</h2>
            <p className="text-sm text-muted-foreground">{company.email}</p>
          </div>

          <div className="ml-auto flex gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="relative text-muted-foreground"
                disabled={isUploading}
              >
                +
                {isUploading
                  ? "Uploading..."
                  : t("button.uploadLogo") || "Upload Logo"}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                />
              </Button>
            </div>

            {companyLogo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveLogo}
                className="text-destructive hover:text-destructive"
                disabled={isUploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <h3 className="text-base font-semibold mb-4">
          {t("title.companyDetails") || "Company Details"}
        </h3>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.companyName.label") || "Company Name"}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.businessEmail.label") || "Business Email"}
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
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.websiteUrl.label") || "Website URL (Optional)"}
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
                name="phone"
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.businessNumber.label") || "Business Number"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-base font-semibold mb-4">
              {t("title.businessAddress") || "Business Address"}
            </h3>

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.streetAddress.label") || "Street Address"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.city.label") || "City"}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              t("form.city.placeholder") || "Select city"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Doha">Doha</SelectItem>
                        <SelectItem value="Al Rayyan">Al Rayyan</SelectItem>
                        <SelectItem value="Al Wakrah">Al Wakrah</SelectItem>
                        <SelectItem value="Al Khor">Al Khor</SelectItem>
                      </SelectContent>
                    </Select>
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
                      {t("form.stateProvince.label") || "State/Province"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              t("form.stateProvince.placeholder") ||
                              "Select state/province"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Doha Municipality">
                          Doha Municipality
                        </SelectItem>
                        <SelectItem value="Al Rayyan Municipality">
                          Al Rayyan Municipality
                        </SelectItem>
                        <SelectItem value="Al Wakrah Municipality">
                          Al Wakrah Municipality
                        </SelectItem>
                        <SelectItem value="Al Khor Municipality">
                          Al Khor Municipality
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                      {t("form.postalCode.label") || "Postal Code"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    );
  }
);

CompanySettingsForm.displayName = "CompanySettingsForm";
