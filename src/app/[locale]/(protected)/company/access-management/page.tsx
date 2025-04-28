"use client"

import { DeleteDialog } from "@/components/delete-dailog"
import { Loader } from "@/components/loader"
import { AddStaffForm } from "@/components/staff/addStaffForm"
import { EditUserForm } from "@/components/staff/editUserForm"
import { StaffTable } from "@/components/staffTable"
import { Button } from "@/components/ui/button"
import { PERMISSIONS } from "@/constants/rbac"
import { useRBAC } from "@/lib/hooks/useRBAC"
import { NAVIGATION_EVENTS, navigationEvents } from "@/lib/navigation-events"
import type { staffFormSchema } from "@/schema/protected/company"
import { companyService, type StaffMember } from "@/services/protected/company"
import { getErrorMessage } from "@/utils/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ArrowLeft, PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type * as z from "zod"

export default function AccessManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [showEditForm, setShowEditForm] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const t = useTranslations()
  const { hasPermission } = useRBAC();

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
        languagesSpoken: variables.languagesSpoken ?? "English",
      }

      const updatedStaffList = staff.map((s) => (s.id === selectedStaff?.id ? updatedStaffMember : s))

      setStaff(updatedStaffList)
      toast.success(response.message || t("toast.staffUpdated") || "Staff member updated successfully")
      setShowEditForm(false)
      refetchStaff()
    },
    onError: (error: any) => {
      console.log("Failed to update staff:", error)
      toast.error(error?.message ?? t("toast.updateFailed") ?? "Failed to update staff member")
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
      toast.error(error?.message ?? t("text.deleteFailed") ?? "Failed to delete staff member")
    },
  })

  // Complete the getStaffById mutation implementation
  const getStaffByIdMutation = useMutation({
    mutationKey: ["getStaffById"],
    mutationFn: companyService.getStaffById,
    onSuccess: (response) => {
      // If response is empty, use the selectedStaff that was set before the API call
      if (!response || Object.keys(response).length === 0) {
        // We already set selectedStaff in handleEditClick, so we can just proceed
        setShowAddForm(false)
        setShowEditForm(true)
        return
      }

      // If we have a response with data property
      if (response.data) {
        const staffMember = response.data;
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

  // Function to reset the page state
  const resetPageState = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setSelectedStaff(null)
    refetchStaff()
  }

  // Listen for navigation events
  useEffect(() => {
    // Subscribe to the reset event
    const unsubscribe = navigationEvents.subscribe(NAVIGATION_EVENTS.RESET_ACCESS_MANAGEMENT, resetPageState)

    // Cleanup subscription on unmount
    return unsubscribe
  }, [])

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
      ...(data as any),
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
      email: staffMember.email ?? staffMember.user?.email ?? "",
      status: staffMember.status ?? (staffMember.active ? "active" : "inactive"),
      canAddProperty: staffMember.staffPermissions?.[0]?.canAddProperty ?? true,
      canPublishProperty: staffMember.staffPermissions?.[0]?.canPublishProperty ?? true,
      canFeatureProperty: staffMember.staffPermissions?.[0]?.canFeatureProperty ?? false,
      biography: staffMember.biography ?? "",
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

  const handleCloseDeleteDialog = () => {
    if (!deleteStaffMutation.isPending) {
      setIsDeleteDialogOpen(!isDeleteDialogOpen)
    }
    return
  }

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading}></Loader>

      <div className="flex justify-between items-center">



        <h1 className="text-2xl font-bold">
          {(showAddForm || showEditForm) && <Button variant="ghost" className="p-0 mr-2" onClick={() => {
            setShowAddForm(false)
            setShowEditForm(false)
          }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>}
          {t("title.accessManagement") || "Access Management"}</h1>

        {(showAddForm || showEditForm) || hasPermission(PERMISSIONS.CREATE_USER) && <Button
          className="bg-primary text-white hover:bg-primary/90"
          onClick={() => {
            // Reset all form states first
            setSelectedStaff(null)

            if (showEditForm) {
              setShowEditForm(false)
            } else {
              setShowAddForm(!showAddForm)
            }
          }}
          disabled={isSubmitting}
        >
          <>
            <PlusCircle className="mr-2 h-4 w-4" /> {t("button.addNewAgent") || "Add New Agent"}
          </>
        </Button>}
      </div>

      {/* Company Agents Section */}
      <div className="bg-white rounded-md shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t("title.companyAgents") || "Company Agents"}</h2>

          {(() => {
            if (showAddForm) {
              return (
                <AddStaffForm
                  onSubmit={handleAddStaff}
                  onCancel={handleToggleAddForm}
                  isSubmitting={inviteStaffMutation.isPending}
                />
              );
            }
            if (showEditForm) {
              return (
                <EditUserForm
                  selectedStaff={selectedStaff}
                  onSubmit={handleUpdateStaff}
                  onCancel={handleCancelEdit}
                  isSubmitting={updateStaffMutation.isPending}
                />
              );
            }
            if (isLoadingStaff && staff.length === 0) {
              return <p>{t("text.loadingStaff") || "Loading staff members..."}</p>;
            }
            return <StaffTable staff={staff} onEdit={handleEditClick} onDelete={handleDeleteClick} />;
          })()}
        </div>
      </div>

      {/* Delete Agent Dialog */}
      <DeleteDialog
        title={t("title.deleteAgent")}
        deleteConfirmation={t("text.deleteAgentConfirmation")}
        isOpen={isDeleteDialogOpen}
        onOpenChange={handleCloseDeleteDialog}
        onDelete={handleDeleteStaff}
        isSubmitting={deleteStaffMutation.isPending}
      />
    </div>
  )
}
