"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UseFormReturn } from "react-hook-form"
import type * as z from "zod"
import type { staffFormSchema } from "@/schema/company"

interface StaffFormFieldsProps {
    form: UseFormReturn<z.infer<typeof staffFormSchema>>
    t: any // Translation function
}

export function StaffFormFields({ form, t }: StaffFormFieldsProps) {
    return (
        <>
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
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("form.phoneNumber.label") || "Phone Number"}</FormLabel>
                        <FormControl>
                            <Input placeholder={t("form.phoneNumber.placeholder") || "+972 0000 0000"} {...field} />
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
        </>
    )
}

