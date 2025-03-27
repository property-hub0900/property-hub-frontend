/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type * as z from "zod"
import { staffFormSchema } from "@/schema/company"
import type { StaffMember } from "@/services/company"
import { useTranslations } from "next-intl"
import { Separator } from "../ui/separator"

interface EditUserFormProps {
    selectedStaff: StaffMember | null
    onSubmit: (data: z.infer<typeof staffFormSchema>) => void
    onCancel: () => void
    isSubmitting: boolean
}

export function EditUserForm({ selectedStaff, onSubmit, onCancel, isSubmitting }: EditUserFormProps) {
    const [showPermissionsSection, setShowPermissionsSection] = useState(true)
    const t = useTranslations()

    const form = useForm<z.infer<typeof staffFormSchema>>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            firstName: selectedStaff?.firstName || "",
            lastName: selectedStaff?.lastName || "",
            email: selectedStaff?.email || "",
            role: selectedStaff?.role || "agent",
            phoneNumber: selectedStaff?.phoneNumber || "",
            languagesSpoken: selectedStaff?.languagesSpoken || "English & Arabic",
            status: selectedStaff?.status || "active",
            canAddProperty: selectedStaff?.canAddProperty ?? true,
            canPublishProperty: selectedStaff?.canPublishProperty ?? true,
            canFeatureProperty: selectedStaff?.canFeatureProperty ?? false,
            biography: selectedStaff?.biography || "",
        },
    })

    // Update form when selectedStaff changes
    useEffect(() => {
        if (selectedStaff) {
            // Map the staff data to form values, handling the nested structure
            form.reset({
                firstName: selectedStaff.firstName || "",
                lastName: selectedStaff.lastName || "",
                // Use email from user object if available, otherwise use direct email property
                email: selectedStaff.email || selectedStaff.user?.email || "",
                role: selectedStaff.role || "agent",
                phoneNumber: selectedStaff.phoneNumber || "",
                languagesSpoken: selectedStaff.languagesSpoken || "English & Arabic",
                // Map active boolean to status string if needed
                status: selectedStaff.status || (selectedStaff.active ? "active" : "inactive"),
                // Get permissions from the staffPermissions array if available
                canAddProperty: selectedStaff.canAddProperty ?? selectedStaff.staffPermissions?.[0]?.canAddProperty ?? true,
                canPublishProperty:
                    selectedStaff.canPublishProperty ?? selectedStaff.staffPermissions?.[0]?.canPublishProperty ?? true,
                canFeatureProperty:
                    selectedStaff.canFeatureProperty ?? selectedStaff.staffPermissions?.[0]?.canFeatureProperty ?? false,
                // Use biography field if bio is not available
                biography: selectedStaff.biography || selectedStaff.biography || "",
            })

            console.log("Form reset with staff data:", selectedStaff)
        }
    }, [selectedStaff, form])

    // Watch role to determine if permissions section should be shown
    const role = form.watch("role")
    useEffect(() => {
        setShowPermissionsSection(role !== "admin")
    }, [role])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t("title.editUser") || "Edit User"}</h3>

                    <div className="bg-white p-6 rounded-md border border-gray-200">
                        <h4 className="text-base font-medium mb-4">{t("title.userDetails") || "User Details"}</h4>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                                <UserAvatar
                                    src={selectedStaff?.profilePhoto}
                                    firstName={selectedStaff?.firstName || ""}
                                    lastName={selectedStaff?.lastName || ""}
                                    size="lg"
                                />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {selectedStaff ? `${selectedStaff.firstName || ""} ${selectedStaff.lastName || ""}` : ""}
                                </p>
                                <p className="text-sm text-gray-500">{selectedStaff?.email || selectedStaff?.user?.email || ""}</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <Button type="button" variant="outline" size="sm">
                                    + {t("button.uploadPhoto") || "Upload Photo"}
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className="text-red-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-trash-2"
                                    >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" x2="10" y1="11" y2="17" />
                                        <line x1="14" x2="14" y1="11" y2="17" />
                                    </svg>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("form.fullName.label") || "Full Name"}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("form.fullName.placeholder") || "Enter full name"} {...field} />
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
                                        <FormLabel>{t("form.email.label") || "Email Address"}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("form.email.placeholder") || "email@example.com"} type="email" {...field} />
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
                                        <FormLabel>{t("form.phoneNumber.label") || "Phone Number"}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t("form.phoneNumber.placeholder") || "+974 5000 1234"} {...field} />
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
                                                    <SelectValue placeholder={t("form.role.placeholder") || "Select role"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="agent">{t("form.role.options.agent") || "Agent"}</SelectItem>
                                                <SelectItem value="admin">{t("form.role.options.admin") || "Admin"}</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                    <SelectValue placeholder={t("form.status.placeholder") || "Select status"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">{t("form.status.options.active") || "Active"}</SelectItem>
                                                <SelectItem value="inactive">{t("form.status.options.inactive") || "Inactive"}</SelectItem>
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
                                        <FormLabel>{t("form.languages.label") || "Languages Spoken"}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value as string}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t("form.languages.placeholder") || "Select languages"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="English">{t("form.languages.options.english") || "English"}</SelectItem>
                                                <SelectItem value="Arabic">{t("form.languages.options.arabic") || "Arabic"}</SelectItem>
                                                <SelectItem value="English & Arabic">
                                                    {t("form.languages.options.both") || "English & Arabic"}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="biography"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("form.bio.label") || "Bio"}</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder={
                                                        t("form.bio.placeholder") ||
                                                        "With over 5 years of experience in Q star's real estate market..."
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
                </div>

                {showPermissionsSection && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{t("title.permissionsAccess") || "Permissions & Access"}</h3>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-righ">{t("title.access") || "Access"}</p>
                            <span className="text-xs text-right">{t("title.permissions") || "Permissions"}</span>
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
                                            <Switch id="edit-canAddProperty" checked={field.value} onCheckedChange={field.onChange} />
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
                                            {t("form.permissions.requiresApproval") || "Requires Approval for Listings"}
                                        </label>
                                        <FormControl>
                                            <Switch id="edit-canPublishProperty" checked={field.value} onCheckedChange={field.onChange} />
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
                                            {t("form.permissions.canFeatureProperty") || "Can Feature Property"}
                                        </label>
                                        <FormControl>
                                            <Switch id="edit-canFeatureProperty" checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        {t("button.cancel") || "Cancel"}
                    </Button>
                    <Button type="submit" className="bg-primary" disabled={isSubmitting}>
                        {isSubmitting ? t("button.updating") || "Updating..." : t("button.save") || "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

