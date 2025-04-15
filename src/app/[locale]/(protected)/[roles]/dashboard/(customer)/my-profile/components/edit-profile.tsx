"use client";

import { useState, useEffect } from "react";
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

import { UserAvatar } from "@/components/ui/user-avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTranslations } from "next-intl";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { uploadImageToFirebase } from "@/lib/firebaseUtil";
import { DeleteDialog } from "@/components/delete-dailog";
import { ICustomerProfile } from "@/types/protected/customer";
import {
  customerProfileSchema,
  TCustomerProfileSchema,
} from "@/schema/protected/customer";
import { useMutation } from "@tanstack/react-query";
import { customerService } from "@/services/protected/customer";
import { Loader } from "@/components/loader";

interface EditUserFormProps {
  customer: ICustomerProfile;
}

export const EditProfile = ({ customer }: EditUserFormProps) => {
  const t = useTranslations();

  const [isUploading, setIsUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    customer?.profilePhoto || null
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const updateCustomerProfileMutation = useMutation({
    mutationKey: ["updateCustomerProfile"],
    mutationFn: customerService.updateCustomerProfile,
  });

  const form = useForm<TCustomerProfileSchema>({
    resolver: zodResolver(customerProfileSchema(t)),
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phoneNumber: customer?.phoneNumber || "",
      profilePhoto: customer?.profilePhoto || null,
    },
  });

  const onSubmit = async (data: TCustomerProfileSchema) => {
    try {
      const response = await updateCustomerProfileMutation.mutateAsync({
        ...data,
        customerId: customer.customerId,
        id: customer.customerId,
        firebaseToken: "1212",
      });

      toast.success(response.message);

      setProfileImageUrl(null);
    } catch (error) {
      toast.error("An error occurred while processing your request");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      //   setProfileImageFile(file);
      //   const imageUrl = URL.createObjectURL(file);
      //   setProfileImage(imageUrl);
      setIsUploading(true);
      try {
        const downloadURL = await uploadImageToFirebase(file);
        setProfileImageUrl(downloadURL);
      } catch (error) {
        toast.error("Failed to upload profile image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setProfileImageUrl(null);
    //setProfileImageFile(null);
    form.setValue("profilePhoto", null, { shouldDirty: true });
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Loader isLoading={updateCustomerProfileMutation.isPending} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="  p-6 ">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <UserAvatar
                    src={profileImageUrl}
                    firstName={customer?.firstName || ""}
                    lastName={customer?.lastName || ""}
                    size="lg"
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {customer
                      ? `${customer.firstName || ""} ${customer.lastName || ""}`
                      : ""}
                  </p>
                  {/* <p className="text-sm text-gray-500">
                  {customer?.email || customer?.user?.email || ""}
                </p> */}
                </div>
                <div className="ml-auto flex gap-2">
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="relative text-muted-foreground"
                      disabled={isUploading}
                    >
                      +{" "}
                      {isUploading
                        ? "Uploading..."
                        : t("button.uploadPhoto") || "Upload Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </Button>
                  </div>

                  {profileImageUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive hover:text-destructive"
                      disabled={isUploading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.firstName.label")}</FormLabel>
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
                      <FormLabel>{t("form.lastName.label")}</FormLabel>
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
                        {t("form.email.label") || "Email Address"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            t("form.email.placeholder") || "email@example.com"
                          }
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.phoneNumber.label") || "Phone Number"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            t("form.phoneNumber.placeholder") ||
                            "+974 5000 1234"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="submit" className="bg-primary" disabled={isUploading}>
              {t("button.save")}
            </Button>
          </div>

          <DeleteDialog
            title={t("title.deletePhoto") || "Delete Photo"}
            deleteConfirmation={t("text.deletePhotoConfirmation")}
            isSubmitting={false}
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onDelete={handleRemoveImage}
          />
        </form>
      </Form>
    </>
  );
};
