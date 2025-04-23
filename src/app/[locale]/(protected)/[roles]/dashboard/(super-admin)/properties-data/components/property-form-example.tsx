"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PropertyImageUpload,
  type PropertyImage,
} from "./property-image-upload";
import { toast } from "sonner";

import { useTranslations } from "next-intl";

// Define the maximum values
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 3;

// Property image schema
const propertyImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
});

// Form schema with just the image field
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  propertyImages: z
    .array(propertyImageSchema)
    .min(1, "At least one image is required")
    .max(MAX_FILES, `Maximum ${MAX_FILES} images allowed`),
});

type FormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  initialImages?: PropertyImage[];
  onSubmit: any;
  isLoading?: boolean;
}

export function PropertyForm({
  initialImages = [],
  onSubmit,
  isLoading = false,
}: PropertyFormProps) {
  const t = useTranslations();

  // Initialize form with default values or initial data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyImages: initialImages,
    },
  });

  // Handle max files error
  const handleMaxFilesError = () => {
    toast.error(`You can only upload a maximum of ${MAX_FILES} images.`);
  };

  // Handle form submission
  const handleSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data as any);
      // form.reset({ propertyImages: [] });
      toast.success(`Images uploaded successfully!`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to upload images. Please try again.`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
          name="propertyImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Property Images
                <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <FormControl>
                <PropertyImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  maxFiles={MAX_FILES}
                  maxFileSize={`${MAX_FILE_SIZE}`}
                  disabled={isLoading}
                  onMaxFilesError={handleMaxFilesError}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
