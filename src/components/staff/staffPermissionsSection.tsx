"use client";

import { FormField, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { UseFormReturn } from "react-hook-form";
import type * as z from "zod";
import type { staffFormSchema } from "@/schema/protected/company";

interface StaffPermissionsSectionProps {
  form: UseFormReturn<z.infer<typeof staffFormSchema>>;
  t: any; // Translation function
}

export function StaffPermissionsSection({
  form,
  t,
}: StaffPermissionsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {t("title.permissionsAccess") || "Permissions & Access"}
        </h3>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between items-center">
        <p className="text-xs text-righ">{t("title.access") || "Access"}</p>
        <span className="text-xs text-right">
          {t("title.permissions") || "Permissions"}
        </span>
      </div>
      <div className="space-y-6 text-xs">
        <FormField
          control={form.control}
          name="canAddProperty"
          render={({ field }) => (
            <div className="flex justify-between items-center">
              <label htmlFor="edit-canAddProperty" className="text-xm">
                {t("form.permissions.canPostListings") || "Can Post Listings"}
              </label>
              <FormControl>
                <Switch
                  id="edit-canAddProperty"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="canPublishProperty"
          render={({ field }) => (
            <div className="flex justify-between items-center">
              <label htmlFor="edit-canPublishProperty" className="text-xm">
                {t("form.permissions.requiresApproval") ||
                  "Requires Approval for Listings"}
              </label>
              <FormControl>
                <Switch
                  id="edit-canPublishProperty"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="canFeatureProperty"
          render={({ field }) => (
            <div className="flex justify-between items-center">
              <label htmlFor="edit-canFeatureProperty" className="text-xm">
                {t("form.permissions.canFeatureProperty") ||
                  "Can Feature Property"}
              </label>
              <FormControl>
                <Switch
                  id="edit-canFeatureProperty"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
          )}
        />
      </div>
    </div>
  );
}
