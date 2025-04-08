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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffFormSchema } from "@/schema/protected/company";
import { useTranslations } from "next-intl";
import type * as z from "zod";

interface AddStaffFormProps {
  onSubmit: (data: z.infer<typeof staffFormSchema>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function AddStaffForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: AddStaffFormProps) {
  const [showPermissionsSection, setShowPermissionsSection] = useState(true);
  const t = useTranslations();

  const form = useForm<z.infer<typeof staffFormSchema>>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "agent",
      phoneNumber: "",
      languagesSpoken: "English & Arabic",
      status: "active",
      canAddProperty: true,
      canPublishProperty: true,
      canFeatureProperty: false,
      biography: "",
    },
  });

  // Watch role to determine if permissions section should be shown
  const role = form.watch("role");
  useEffect(() => {
    setShowPermissionsSection(role !== "admin");
  }, [role]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">
            {t("title.inviteUser") || "Invite User"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("form.firstName.label") || "First Name"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        t("form.firstName.placeholder") || "Enter first name"
                      }
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
                    {t("form.lastName.label") || "Last Name"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        t("form.lastName.placeholder") || "Enter last name"
                      }
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.role.label") || "Role"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            t("form.role.placeholder") || "Select role"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="agent">
                        {t("form.role.options.agent") || "Agent"}
                      </SelectItem>
                      <SelectItem value="admin">
                        {t("form.role.options.admin") || "Admin"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                        t("form.phoneNumber.placeholder") || "+972 0000 0000"
                      }
                      {...field}
                    />
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                    {t("form.languages.label") || "Languages Spoken"}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            t("form.languages.placeholder") ||
                            "Select languages"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="English">
                        {t("form.languages.options.english") || "English"}
                      </SelectItem>
                      <SelectItem value="Arabic">
                        {t("form.languages.options.arabic") || "Arabic"}
                      </SelectItem>
                      <SelectItem value="English & Arabic">
                        {t("form.languages.options.both") || "English & Arabic"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {showPermissionsSection && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {t("title.permissionsAccess") || "Permissions & Access"}
              </h3>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <p className="text-xs text-righ">
                {t("title.access") || "Access"}
              </p>
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
                      {t("form.permissions.canPostListings") ||
                        "Can Post Listings"}
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
                    <label
                      htmlFor="edit-canPublishProperty"
                      className="text-xm"
                    >
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
                    <label
                      htmlFor="edit-canFeatureProperty"
                      className="text-xm"
                    >
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
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t("button.cancel") || "Cancel"}
          </Button>
          <Button type="submit" className="bg-primary" disabled={isSubmitting}>
            {isSubmitting
              ? t("button.inviting") || "Inviting..."
              : t("button.invite") || "Invite"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
