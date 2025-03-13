"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DataTable } from "@/components/dataTable/data-table"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { companyService, type StaffMember, type StaffRole } from "@/services/company"

// Form schema updated to match API requirements
const staffFormSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    role: z.enum(["agent", "admin"] as const),
    phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
    languages: z.string().optional(),
    status: z.enum(["active", "inactive"]),
    canAddProperty: z.boolean().default(true),
    canPublishProperty: z.boolean().default(true),
    canFeatureProperty: z.boolean().default(false),
})

export default function AccessManagementPage() {
    const [staff, setStaff] = useState<StaffMember[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

    // Form for adding/editing staff
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

    // Fetch staff on component mount
    useEffect(() => {
        const fetchStaff = async () => {
            setIsLoading(true)
            try {
                const response = await companyService.getAllStaff()
                if (response.success) {
                    setStaff(response.data)
                } else {
                    toast.error(response.message || "Failed to fetch staff members")
                }
            } catch (error) {
                console.error("Failed to fetch staff:", error)
                toast.error("Failed to load staff members")
            } finally {
                setIsLoading(false)
            }
        }

        fetchStaff()
    }, [])

    // Reset form when dialog closes
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
    }

    // Open edit dialog with staff data
    const handleEditClick = (staffMember: StaffMember) => {
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

    // Open delete dialog
    const handleDeleteClick = (staffMember: StaffMember) => {
        setSelectedStaff(staffMember)
        setIsDeleteDialogOpen(true)
    }

    // Add new staff member
    const handleAddStaff = async (data: z.infer<typeof staffFormSchema>) => {
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

            if (response.success) {
                // Add the new staff member to the local state
                setStaff([
                    ...staff,
                    {
                        ...response.data,
                        languages: data.languages,
                        status: data.status,
                    },
                ])
                toast.success(response.message || "Staff member invited successfully")
            } else {
                toast.error(response.message || "Failed to invite staff member")
            }
        } catch (error: any) {
            console.error("Failed to add staff:", error)
            toast.error(error?.message || "Failed to invite staff member")
        } finally {
            setIsLoading(false)
            setIsAddDialogOpen(false)
            resetForm()
        }
    }

    // Update existing staff
    const handleUpdateStaff = async (data: z.infer<typeof staffFormSchema>) => {
        if (!selectedStaff) return

        setIsLoading(true)
        try {
            const response = await companyService.updateStaff({
                id: selectedStaff.id,
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

            if (response.success) {
                // Update the staff member in the local state
                const updatedStaffList = staff.map((s) =>
                    s.id === selectedStaff.id
                        ? {
                            ...response.data,
                            languages: data.languages,
                        }
                        : s,
                )
                setStaff(updatedStaffList)
                toast.success(response.message || "Staff member updated successfully")
            } else {
                toast.error(response.message || "Failed to update staff member")
            }
        } catch (error: any) {
            console.error("Failed to update staff:", error)
            toast.error(error?.message || "Failed to update staff member")
        } finally {
            setIsLoading(false)
            setIsEditDialogOpen(false)
            resetForm()
        }
    }

    // Delete staff
    const handleDeleteStaff = async () => {
        if (!selectedStaff) return

        setIsLoading(true)
        try {
            const response = await companyService.deleteStaff(selectedStaff.id)

            if (response.success) {
                // Remove from local state
                const updatedStaff = staff.filter((s) => s.id !== selectedStaff.id)
                setStaff(updatedStaff)
                toast.success(response.message || "Staff member deleted successfully")
            } else {
                toast.error(response.message || "Failed to delete staff member")
            }
        } catch (error: any) {
            console.error("Failed to delete staff:", error)
            toast.error(error?.message || "Failed to delete staff member")
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
        }
    }

    // Table columns
    const columns = [
        {
            accessorFn: (row: StaffMember) => `${row.firstName} ${row.lastName}`,
            header: "Full Name",
            id: "fullName",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }: { row: any }) => {
                const role = row.getValue("role") as StaffRole
                return <span className="capitalize">{role}</span>
            },
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "joinedDate",
            header: "Joined Date",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: any }) => {
                const status = row.getValue("status")
                return (
                    <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${status === "active" ? "bg-green-500" : "bg-gray-400"}`}></div>
                        <span className="capitalize">{status}</span>
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                const staffMember = row.original
                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(staffMember)}
                            className="h-8 w-8 p-0 text-blue-500"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(staffMember)}
                            className="h-8 w-8 p-0 text-red-500"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Access Management</h1>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-500 hover:bg-blue-600">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Agent
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>New Agent</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleAddStaff)} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Invite User</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter first name" {...field} />
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
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter last name" {...field} />
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
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="email@example.com" type="email" {...field} />
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
                                                    <FormLabel>Role</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select role" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="agent">Agent</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
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
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+972 0000 0000" {...field} />
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
                                                    <FormLabel>Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
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
                                                    <FormLabel>Languages Spoken</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select languages" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="English">English</SelectItem>
                                                            <SelectItem value="Arabic">Arabic</SelectItem>
                                                            <SelectItem value="English & Arabic">English & Arabic</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium">Permissions & Access</h3>
                                        <span className="text-xs text-right">Permissions</span>
                                    </div>

                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="canAddProperty"
                                            render={({ field }) => (
                                                <div className="flex justify-between items-center">
                                                    <label htmlFor="canAddProperty" className="text-sm">
                                                        Can Post Listings
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
                                                        Requires Approval for Listings
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
                                                        Can Feature Property
                                                    </label>
                                                    <FormControl>
                                                        <Switch id="canFeatureProperty" checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsAddDialogOpen(false)
                                            resetForm()
                                        }}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
                                        {isLoading ? "Inviting..." : "Invite"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Agent Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Agent</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleUpdateStaff)} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">User Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter first name" {...field} />
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
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter last name" {...field} />
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
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email@example.com" type="email" {...field} />
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
                                                <FormLabel>Role</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="agent">Agent</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
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
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+972 0000 0000" {...field} />
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
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
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
                                                <FormLabel>Languages Spoken</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select languages" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="English">English</SelectItem>
                                                        <SelectItem value="Arabic">Arabic</SelectItem>
                                                        <SelectItem value="English & Arabic">English & Arabic</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium">Permissions & Access</h3>
                                    <span className="text-xs text-right">Permissions</span>
                                </div>

                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="canAddProperty"
                                        render={({ field }) => (
                                            <div className="flex justify-between items-center">
                                                <label htmlFor="edit-canAddProperty" className="text-sm">
                                                    Can Post Listings
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
                                                    Requires Approval for Listings
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
                                                <label htmlFor="edit-canFeatureProperty" className="text-sm">
                                                    Can Feature Property
                                                </label>
                                                <FormControl>
                                                    <Switch id="edit-canFeatureProperty" checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false)
                                        resetForm()
                                    }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
                                    {isLoading ? "Updating..." : "Update"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Agent Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Agent</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this agent? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDeleteStaff} disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Company Agents Section */}
            <div className="bg-white rounded-md shadow">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Company Agents</h2>
                    {isLoading && staff.length === 0 ? (
                        <p>Loading staff members...</p>
                    ) : (
                        <DataTable columns={columns} data={staff} />
                    )}
                </div>
            </div>
        </div>
    )
}

