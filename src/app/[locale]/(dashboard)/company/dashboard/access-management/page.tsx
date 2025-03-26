"use client"

import { useState, useEffect } from "react"
import { Loader } from "@/components/loader"
import { StaffTable } from "@/components/staffTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query"
import { companyService, type StaffMember } from "@/services/company"
import { getErrorMessage } from "@/lib/utils"
import type { staffFormSchema } from "@/schema/company"
import { AddStaffForm } from "@/components/staff/addStaffForm"
import { EditUserForm } from "@/components/staff/editUserForm"
import { DeleteStaffDialog } from "@/components/staff/deleteStaffDialog"
import type * as z from "zod"

export default function AccessManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [showEditForm, setShowEditForm] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const t = useTranslations()

  // Use React Query to fetch staff
  const { isLoading: isLoadingStaff, refetch: refetchStaff } = useQuery({
    queryKey: ["getAllStaff"],
    queryFn: async () => {
      try {
        const response: any = await companyService.getAllStaff()

        // Handle different response formats
        if (response.data) {
          setStaff(response.data as StaffMember[])
        } else if (response.results) {
          setStaff(response.results as StaffMember[])
        }
        return response
      } catch (error: any) {
        console.log("Failed to fetch staff:", error)
        toast.error(getErrorMessage(error))
        throw error
      }
    },
  })

  // Use React Query for inviting staff
  const inviteStaffMutation = useMutation({
    mutationKey: ["inviteStaff"],
    mutationFn: companyService.inviteStaff,
    onSuccess: (response, variables) => {
      // Create a properly typed staff member
      const newStaffMember: StaffMember = {
        ...(response.data as StaffMember),
        languagesSpoken: variables.languagesSpoken || "English & Arabic",
        status: variables.status || ("active" as any),
      }

      setStaff([...staff, newStaffMember])
      toast.success(response.message || t("toast.staffInvited") || "Staff member invited successfully")
      setShowAddForm(false)
      refetchStaff()
    },
    onError: (error: any) => {
      console.log("Failed to add staff:", error)
      toast.error(getErrorMessage(error))
    },
  })

  // Use React Query for updating staff
  const updateStaffMutation = useMutation({
    mutationKey: ["updateStaff"],
    mutationFn: companyService.updateStaff,
    onSuccess: (response, variables) => {
      // Create a properly typed updated staff member
      const updatedStaffMember: StaffMember = {
        ...(response.data as StaffMember),
        languagesSpoken: variables.languagesSpoken || "English",
      }

      const updatedStaffList = staff.map((s) => (s.id === selectedStaff?.id ? updatedStaffMember : s))

      setStaff(updatedStaffList)
      toast.success(response.message || t("toast.staffUpdated") || "Staff member updated successfully")
      setShowEditForm(false)
      refetchStaff()
    },
    onError: (error: any) => {
      console.log("Failed to update staff:", error)
      toast.error(error?.message || t("toast.updateFailed") || "Failed to update staff member")
    },
  })

  // Use React Query for deleting staff
  const deleteStaffMutation = useMutation({
    mutationKey: ["deleteStaff"],
    mutationFn: (staffId: string) => companyService.deleteStaff(staffId),
    onSuccess: () => {
      if (selectedStaff) {
        const updatedStaff = staff.filter((s) => s.staffId !== selectedStaff.staffId)
        setStaff(updatedStaff)
      }
      toast.success(t("text.staffDeleted") || "Staff member deleted successfully")
      setIsDeleteDialogOpen(false)
      refetchStaff()
    },
    onError: (error: any) => {
      console.log("Failed to delete staff:", error)
      toast.error(error?.message || t("text.deleteFailed") || "Failed to delete staff member")
    },
  })

  // Complete the getStaffById mutation implementation
  const getStaffByIdMutation = useMutation({
    mutationKey: ["getStaffById"],
    mutationFn: companyService.getStaffById,
    onSuccess: (response) => {
      console.log("Response from getStaffById:", response)

      // If response is empty, use the selectedStaff that was set before the API call
      if (!response || Object.keys(response).length === 0) {
        console.log("Using fallback staff data")
        // We already set selectedStaff in handleEditClick, so we can just proceed
        setShowAddForm(false)
        setShowEditForm(true)
        return
      }

      // If we have a response with data property
      if (response.data) {
        const staffMember = response.data as StaffMember
        setSelectedStaff(staffMember)
      } else {
        // If response has a different structure, try to use it directly
        setSelectedStaff(response as unknown as StaffMember)
      }

      setShowAddForm(false)
      setShowEditForm(true)
    },
    onError: (error: any) => {
      console.log("Failed to fetch staff by ID:", error)
      toast.error(getErrorMessage(error))
      // Still show the edit form with the data we already have
      setShowEditForm(true)
    },
  })

  useEffect(() => {
    refetchStaff()
  }, [refetchStaff, showAddForm])

  // Determine if any mutation is in progress
  const isSubmitting =
    inviteStaffMutation.isPending ||
    updateStaffMutation.isPending ||
    deleteStaffMutation.isPending ||
    getStaffByIdMutation.isPending
  const isLoading = isLoadingStaff || isSubmitting

  // Event handlers
  const handleAddStaff = (data: z.infer<typeof staffFormSchema>) => {
    inviteStaffMutation.mutate(data as any)
  }

  const handleUpdateStaff = (data: z.infer<typeof staffFormSchema>) => {
    if (!selectedStaff) return
    updateStaffMutation.mutate({
      id: selectedStaff.staffId,
      ...data,
    })
  }

  const handleDeleteStaff = () => {
    if (!selectedStaff) return
    deleteStaffMutation.mutate(selectedStaff.staffId)
  }

  const handleEditClick = (staffMember: any) => {
    if (isSubmitting) return

    // Set the selected staff member first as a fallback with all available data
    setSelectedStaff({
      ...staffMember,
      email: staffMember.email || staffMember.user?.email || "",
      status: staffMember.status || (staffMember.active ? "active" : "inactive"),
      canAddProperty: staffMember.staffPermissions?.[0]?.canAddProperty ?? true,
      canPublishProperty: staffMember.staffPermissions?.[0]?.canPublishProperty ?? true,
      canFeatureProperty: staffMember.staffPermissions?.[0]?.canFeatureProperty ?? false,
      biography: staffMember.biography || "",
    })

    // Try to get more complete data from API
    getStaffByIdMutation.mutate(staffMember.staffId)
  }

  const handleDeleteClick = (staffMember: StaffMember) => {
    if (isSubmitting) return
    setSelectedStaff(staffMember)
    setIsDeleteDialogOpen(true)
  }

  const handleToggleAddForm = () => {
    if (isSubmitting) return
    setShowAddForm(!showAddForm)
  }

  const handleCancelEdit = () => {
    if (!updateStaffMutation.isPending) {
      setShowEditForm(false)
    }
  }

  const handleCloseDeleteDialog = (open: boolean) => {
    if (!deleteStaffMutation.isPending) {
      setIsDeleteDialogOpen(open)
    }
  }

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading}></Loader>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title.accessManagement") || "Access Management"}</h1>
        <Button
          className="bg-primary text-white hover:bg-primary/90"
          onClick={() => {
            if (showEditForm) {
              setShowEditForm(false)
            } else {
              setShowAddForm(!showAddForm)
            }
          }}
          disabled={isSubmitting}
        >
          {showAddForm || showEditForm ? (
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
            <AddStaffForm
              onSubmit={handleAddStaff}
              onCancel={handleToggleAddForm}
              isSubmitting={inviteStaffMutation.isPending}
            />
          ) : showEditForm ? (
            <EditUserForm
              selectedStaff={selectedStaff}
              onSubmit={handleUpdateStaff}
              onCancel={handleCancelEdit}
              isSubmitting={updateStaffMutation.isPending}
            />
          ) : isLoadingStaff && staff.length === 0 ? (
            <p>{t("text.loadingStaff") || "Loading staff members..."}</p>
          ) : (
            <StaffTable staff={staff} onEdit={handleEditClick} onDelete={handleDeleteClick} />
          )}
        </div>
      </div>

      {/* Delete Agent Dialog */}
      <DeleteStaffDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={handleCloseDeleteDialog}
        onDelete={handleDeleteStaff}
        isSubmitting={deleteStaffMutation.isPending}
      />
    </div>
  )
}

