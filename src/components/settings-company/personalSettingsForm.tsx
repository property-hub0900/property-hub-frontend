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
import { companyService } from "@/services/protected/company";
import { Loader } from "@/components/loader";
import { getErrorMessage } from "@/utils/utils";
import { uploadImageToFirebase } from "@/lib/firebaseUtil";
import { UserAvatar } from "../ui/user-avatar";
import { DeleteDialog } from "../delete-dailog";
// import { DeleteDialog } from "./delete-dailog";

const personalSettingsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  status: z.string().optional(),
  languagesSpoken: z.string().optional(),
  biography: z.string().optional(),
  profilePhoto: z.any().optional(),
});

type PersonalSettingsFormValues = z.infer<typeof personalSettingsSchema>;

interface PersonalSettingsFormProps {
  userData: any;
}

export const PersonalSettingsForm = forwardRef<any, PersonalSettingsFormProps>(
  ({ userData }, ref) => {
    const t = useTranslations();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(
      userData.profilePhoto || null
    );
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const form = useForm<PersonalSettingsFormValues>({
      resolver: zodResolver(personalSettingsSchema),
      defaultValues: {
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        email: userData.user?.email || userData.email || "",
        status: userData.active ? "active" : "inactive",
        languagesSpoken: userData.languagesSpoken || "English & Arabic",
        biography: userData.biography || "",
        profilePhoto: userData.profilePhoto || "",
      },
    });

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      submit: async () => {
        return form.handleSubmit(onSubmit)();
      },
      reset: () => {
        form.reset();
        setProfileImage(userData.profilePhoto || null);
        setProfileImageFile(null);
      },
    }));

    const onSubmit = async (data: PersonalSettingsFormValues) => {
      try {
        setIsSubmitting(true);

        if (profileImageFile) {
          setIsUploading(true);
          try {
            const downloadURL = await uploadImageToFirebase(profileImageFile);
            data.profilePhoto = downloadURL;
            setProfileImage(downloadURL);
          } catch (error) {
            console.error("Failed to upload profile image:", error);
            toast.error("Failed to upload profile image");
            setIsUploading(false);
            setIsSubmitting(false);
            return;
          } finally {
            setIsUploading(false);
          }
        } else if (profileImage === null) {
          // If image was removed
          data.profilePhoto = null;
        }

        const response = await companyService.updateStaff({
          id: userData.staffId,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          biography: data.biography,
          languagesSpoken: data.languagesSpoken,
          profilePhoto: data.profilePhoto,
        });

        toast.success(response.message || "Profile updated successfully");

        // Reset the file state after successful upload
        setProfileImageFile(null);
        return response;
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error(getErrorMessage(error));
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Store the file for later upload
        setProfileImageFile(file);

        // Create a temporary local URL for preview
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);
      }
    };

    const handleRemoveImage = () => {
      setIsDeleting(true);
      setProfileImage(null);
      setProfileImageFile(null);
      form.setValue("profilePhoto", "", { shouldDirty: true });
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      return;
    };

    return (
      <div className="p-14">
        <Loader isLoading={isSubmitting || isUploading} />

        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <UserAvatar
              src={profileImage || "asdfasdfa"}
              firstName={userData.firstName}
              lastName={userData.lastName}
              size="xl"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {userData.user?.email || userData.email}
            </p>
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
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </Button>
            </div>

            {profileImage && (
              <Button
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

        <h3 className="text-base font-semibold mb-4">
          {t("title.personalDetails") || "Personal Details"}
        </h3>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.firstName.label") || "First Name"}
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.lastName.label") || "Last Name"}
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
                      {t("form.email.label") || "Email Address"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.phoneNumber.label") || "Phone Number"}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.status.label") || "Status"}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!userData.isOwner}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              t("form.status.placeholder") || "Select status"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">
                          {t("form.status.options.active") || "Active"}
                        </SelectItem>
                        <SelectItem value="inactive">
                          {t("form.status.options.inactive") || "Inactive"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languagesSpoken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.languagesSpoken.label") || "Languages Spoken"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              t("form.languagesSpoken.placeholder") ||
                              "Select languages"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                        <SelectItem value="English & Arabic">
                          English & Arabic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.address.label") || "Address"}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {/* make dialogue */}
        <DeleteDialog
          title={t("title.deletePhoto") || "Delete Photo"}
          deleteConfirmation={t("text.deletePhotoConfirmation") || "Are you sure you want to delete this agent? This action cannot be undone."}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleRemoveImage}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }
);

PersonalSettingsForm.displayName = "PersonalSettingsForm";
