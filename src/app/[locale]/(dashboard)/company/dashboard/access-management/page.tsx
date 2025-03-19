"use client"

import { useEffect, useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { toast } from "sonner"
import { companyService, type StaffMember } from "@/services/company"
import { staffFormSchema } from "@/schema/company"
import { StaffTable } from "@/components/staffTable"
import { useTranslations } from "next-intl"
import { getErrorMessage } from "@/lib/utils"

// Define a type that extends StaffMember to handle response data
type ExtendedStaffMember = StaffMember & {
    languages?: string
}

export default function AccessManagementPage() {
    const [staff, setStaff] = useState<ExtendedStaffMember[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<ExtendedStaffMember | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showPermissionsSection, setShowPermissionsSection] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const t = useTranslations()

    const form = useForm<z.infer<typeof staffFormSchema>>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            role: "agent",
            phoneNumber: "",
            languages: "English & Arabic",
            status: "active",
            canAddProperty: true,
            canPublishProperty: true,
            canFeatureProperty: false,
        },
    })

    const role = form.watch("role")
    useEffect(() => {
        setShowPermissionsSection(role !== "admin")
    }, [role])

    useEffect(() => {
        fetchStaff()
    }, [t, showAddForm])

    const fetchStaff = async () => {
        setIsLoading(true)
        try {
            const response: any = await companyService.getAllStaff()

            // Handle different response formats
            if (response.data) {
                setStaff(response.data as ExtendedStaffMember[])
            } else if (response.results) {
                setStaff(response.results as ExtendedStaffMember[])
            }
        } catch (error: any) {
            console.log("Failed to fetch staff:", error)
            toast.error(getErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        form.reset({
            firstName: "",
            lastName: "",
            email: "",
            role: "agent",
            phoneNumber: "",
            languages: "English & Arabic",
            status: "active",
            canAddProperty: true,
            canPublishProperty: true,
            canFeatureProperty: false,
        })
        setShowPermissionsSection(true)
    }

    const handleEditClick = (staffMember: ExtendedStaffMember) => {
        if (isSubmitting) return

        setSelectedStaff(staffMember)
        form.reset({
            firstName: staffMember.firstName,
            lastName: staffMember.lastName,
            email: staffMember.email,
            role: staffMember.role,
            phoneNumber: staffMember.phoneNumber,
            languages: staffMember.languages || "English",
            status: staffMember.status,
            canAddProperty: staffMember.canAddProperty,
            canPublishProperty: staffMember.canPublishProperty,
            canFeatureProperty: staffMember.canFeatureProperty,
        })
        setIsEditDialogOpen(true)
    }

    const handleDeleteClick = (staffMember: ExtendedStaffMember) => {
        if (isSubmitting) return

        setSelectedStaff(staffMember)
        setIsDeleteDialogOpen(true)
    }

    const handleAddStaff = async (data: z.infer<typeof staffFormSchema>) => {
        setIsSubmitting(true)
        setIsLoading(true)

        try {
            const response = await companyService.inviteStaff({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
                phoneNumber: data.phoneNumber,
                canAddProperty: data.canAddProperty,
                canPublishProperty: data.canPublishProperty,
                canFeatureProperty: data.canFeatureProperty,
            })

            // Create a properly typed staff member
            const newStaffMember: ExtendedStaffMember = {
                ...(response.data as StaffMember),
                languages: data.languages,
                status: data.status,
            }

            setStaff([...staff, newStaffMember])
            toast.success(response.message || t("toast.staffInvited") || "Staff member invited successfully")
            setShowAddForm(false)
            resetForm()
        } catch (error: any) {
            console.log("Failed to add staff:", error)
            toast.error(getErrorMessage(error))
        } finally {
            setIsLoading(false)
            setIsSubmitting(false)
        }
    }

    const handleUpdateStaff = async (data: z.infer<typeof staffFormSchema>) => {
        if (!selectedStaff) return

        setIsSubmitting(true)
        setIsLoading(true)

        try {
            const response = await companyService.updateStaff({
                id: selectedStaff.staffId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
                phoneNumber: data.phoneNumber,
                status: data.status,
                canAddProperty: data.canAddProperty,
                canPublishProperty: data.canPublishProperty,
                canFeatureProperty: data.canFeatureProperty,
            })

            // Create a properly typed updated staff member
            const updatedStaffMember: ExtendedStaffMember = {
                ...(response.data as StaffMember),
                languages: data.languages,
            }

            const updatedStaffList = staff.map((s) => (s.id === selectedStaff.id ? updatedStaffMember : s))

            setStaff(updatedStaffList)
            toast.success(response.message || t("toast.staffUpdated") || "Staff member updated successfully")
            setIsEditDialogOpen(false)
            resetForm()
        } catch (error: any) {
            console.log("Failed to update staff:", error)
            toast.error(error?.message || t("toast.updateFailed") || "Failed to update staff member")
        } finally {
            setIsLoading(false)
            setIsSubmitting(false)
        }
    }

    const handleDeleteStaff = async () => {
        if (!selectedStaff) return

        setIsSubmitting(true)
        setIsLoading(true)

        try {
            await companyService.deleteStaff(selectedStaff.staffId)
            debugger;
            const updatedStaff = staff.filter((s) => s.staffId !== selectedStaff.staffId);
            setStaff(updatedStaff)
            toast.success(t("text.staffDeleted") || "Staff member deleted successfully")
            setIsDeleteDialogOpen(false)
        } catch (error: any) {
            console.log("Failed to delete staff:", error)
            toast.error(error?.message || t("text.deleteFailed") || "Failed to delete staff member")
        } finally {
            setIsLoading(false)
            setIsSubmitting(false)
        }
    }

    const handleCloseEditDialog = (open: boolean) => {
        if (!isSubmitting) {
            setIsEditDialogOpen(open)
            if (!open) {
                resetForm()
            }
        }
    }

    const handleCloseDeleteDialog = (open: boolean) => {
        if (!isSubmitting) {
            setIsDeleteDialogOpen(open)
        }
    }

    const handleToggleAddForm = () => {
        if (isSubmitting) return

        setShowAddForm(!showAddForm)
        if (!showAddForm) {
            resetForm()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t("title.accessManagement") || "Access Management"}</h1>
                <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleToggleAddForm} disabled={isSubmitting}>
                    {showAddForm ? (
                        t("button.cancel") || "Cancel"
                    ) : (
                        <>
                            <PlusCircle className="mr-2 h-4 w-4" /> {t("button.addNewAgent") || "Add New Agent"}
                        </>
                    )}
                </Button>
            </div>

            {/* Company Agents Section */}
            <div className="bg-white rounded-md shadow">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">{t("title.companyAgents") || "Company Agents"}</h2>

                    {showAddForm ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleAddStaff)} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">{t("title.inviteUser") || "Invite User"}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("form.firstName.label") || "First Name"}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t("form.firstName.placeholder") || "Enter first name"} {...field} />
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
                                                    <FormLabel>{t("form.lastName.label") || "Last Name"}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t("form.lastName.placeholder") || "Enter last name"} {...field} />
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
                                                        <Input
                                                            placeholder={t("form.email.placeholder") || "email@example.com"}
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
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={t("form.status.placeholder") || "Select status"} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="active">{t("form.status.options.active") || "Active"}</SelectItem>
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
                                            name="languages"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("form.languages.label") || "Languages Spoken"}</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={t("form.languages.placeholder") || "Select languages"} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="English">
                                                                {t("form.languages.options.english") || "English"}
                                                            </SelectItem>
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
                                    </div>
                                </div>

                                {showPermissionsSection && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-sm font-medium">{t("title.permissionsAccess") || "Permissions & Access"}</h3>
                                            <span className="text-xs text-right">{t("title.permissions") || "Permissions"}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="canAddProperty"
                                                render={({ field }) => (
                                                    <div className="flex justify-between items-center">
                                                        <label htmlFor="canAddProperty" className="text-sm">
                                                            {t("form.permissions.canPostListings") || "Can Post Listings"}
                                                        </label>
                                                        <FormControl>
                                                            <Switch id="canAddProperty" checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </div>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="canPublishProperty"
                                                render={({ field }) => (
                                                    <div className="flex justify-between items-center">
                                                        <label htmlFor="canPublishProperty" className="text-sm">
                                                            {t("form.permissions.requiresApproval") || "Requires Approval for Listings"}
                                                        </label>
                                                        <FormControl>
                                                            <Switch id="canPublishProperty" checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </div>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="canFeatureProperty"
                                                render={({ field }) => (
                                                    <div className="flex justify-between items-center">
                                                        <label htmlFor="canFeatureProperty" className="text-sm">
                                                            {t("form.permissions.canFeatureProperty") || "Can Feature Property"}
                                                        </label>
                                                        <FormControl>
                                                            <Switch id="canFeatureProperty" checked={field.value} onCheckedChange={field.onChange} />
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
                                        onClick={handleToggleAddForm}
                                        disabled={isLoading || isSubmitting}
                                    >
                                        {t("button.cancel") || "Cancel"}
                                    </Button>
                                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading || isSubmitting}>
                                        {isLoading || isSubmitting ? t("button.inviting") || "Inviting..." : t("button.invite") || "Invite"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    ) : isLoading && staff.length === 0 ? (
                        <p>{t("text.loadingStaff") || "Loading staff members..."}</p>
                    ) : (
                        <StaffTable staff={staff} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                    )}
                </div>
            </div>

            {/* Edit Agent Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("title.editAgent") || "Edit Agent"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleUpdateStaff)} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">{t("title.editUser") || "Edit User"}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("form.firstName.label") || "First Name"}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t("form.firstName.placeholder") || "Enter first name"} {...field} />
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
                                                <FormLabel>{t("form.lastName.label") || "Last Name"}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t("form.lastName.placeholder") || "Enter last name"} {...field} />
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
                                                    <Input
                                                        placeholder={t("form.email.placeholder") || "email@example.com"}
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        name="languages"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("form.languages.label") || "Languages Spoken"}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                </div>
                            </div>

                            {showPermissionsSection && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium">{t("title.permissionsAccess") || "Permissions & Access"}</h3>
                                        <span className="text-xs text-right">{t("title.permissions") || "Permissions"}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="canAddProperty"
                                            render={({ field }) => (
                                                <div className="flex justify-between items-center">
                                                    <label htmlFor="edit-canAddProperty" className="text-sm">
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
                                                    <label htmlFor="edit-canPublishProperty" className="text-sm">
                                                        {t("form.permissions.requiresApproval") || "Requires Approval for Listings"}
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
                                                    <label htmlFor="edit-canFeatureProperty" className="text-sm">
                                                        {t("form.permissions.canFeatureProperty") || "Can Feature Property"}
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

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleCloseEditDialog(false)}
                                    disabled={isLoading || isSubmitting}
                                >
                                    {t("button.cancel") || "Cancel"}
                                </Button>
                                <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading || isSubmitting}>
                                    {isLoading || isSubmitting ? t("button.updating") || "Updating..." : t("button.update") || "Update"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Agent Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("title.deleteAgent") || "Delete Agent"}</DialogTitle>
                        <DialogDescription>
                            {t("text.deleteConfirmation") ||
                                "Are you sure you want to delete this agent? This action cannot be undone."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleCloseDeleteDialog(false)}
                            disabled={isLoading || isSubmitting}
                        >
                            {t("button.cancel") || "Cancel"}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteStaff}
                            disabled={isLoading || isSubmitting}
                        >
                            {isLoading || isSubmitting ? t("button.deleting") || "Deleting..." : t("button.delete") || "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

