"use client";

import { EditUserForm } from "@/components/edit-user-form";
import { Loader } from "@/components/loader";
import { StaffTable } from "@/components/staffTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { getErrorMessage } from "@/lib/utils";
import { staffFormSchema } from "@/schema/company";
import { companyService, type StaffMember } from "@/services/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

// Replace the fetchStaff function with useQuery
// Replace the handleAddStaff, handleUpdateStaff, and handleDeleteStaff functions with useMutation
// Update the component to use the mutations

export default function AccessManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
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

  const role = form.watch("role");
  useEffect(() => {
    setShowPermissionsSection(role !== "admin");
  }, [role]);

  // Use React Query to fetch staff
  const { isLoading: isLoadingStaff, refetch: refetchStaff } = useQuery({
    queryKey: ["getAllStaff"],
    queryFn: async () => {
      try {
        const response: any = await companyService.getAllStaff();

        // Handle different response formats
        if (response.data) {
          setStaff(response.data as StaffMember[]);
        } else if (response.results) {
          setStaff(response.results as StaffMember[]);
        }
        return response;
      } catch (error: any) {
        console.log("Failed to fetch staff:", error);
        toast.error(getErrorMessage(error));
        throw error;
      }
    },
  });

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
      };

      setStaff([...staff, newStaffMember]);
      toast.success(
        response.message ||
        t("toast.staffInvited") ||
        "Staff member invited successfully"
      );
      setShowAddForm(false);
      resetForm();
      refetchStaff();
    },
    onError: (error: any) => {
      console.log("Failed to add staff:", error);
      toast.error(getErrorMessage(error));
    },
  });

  // Use React Query for updating staff
  const updateStaffMutation = useMutation({
    mutationKey: ["updateStaff"],
    mutationFn: companyService.updateStaff,
    onSuccess: (response, variables) => {
      // Create a properly typed updated staff member
      const updatedStaffMember: StaffMember = {
        ...(response.data as StaffMember),
        languagesSpoken: variables.languagesSpoken || "English",
      };

      const updatedStaffList = staff.map((s) =>
        s.id === selectedStaff?.id ? updatedStaffMember : s
      );

      setStaff(updatedStaffList);
      toast.success(
        response.message ||
        t("toast.staffUpdated") ||
        "Staff member updated successfully"
      );
      resetForm();
      refetchStaff();
    },
    onError: (error: any) => {
      console.log("Failed to update staff:", error);
      toast.error(
        error?.message ||
        t("toast.updateFailed") ||
        "Failed to update staff member"
      );
    },
  });

  // Use React Query for deleting staff
  const deleteStaffMutation = useMutation({
    mutationKey: ["deleteStaff"],
    mutationFn: (staffId: string) => companyService.deleteStaff(staffId),
    onSuccess: () => {
      if (selectedStaff) {
        const updatedStaff = staff.filter(
          (s) => s.staffId !== selectedStaff.staffId
        );
        setStaff(updatedStaff);
      }
      toast.success(
        t("text.staffDeleted") || "Staff member deleted successfully"
      );
      setIsDeleteDialogOpen(false);
      refetchStaff();
    },
    onError: (error: any) => {
      console.log("Failed to delete staff:", error);
      toast.error(
        error?.message ||
        t("text.deleteFailed") ||
        "Failed to delete staff member"
      );
    },
  });

  // Complete the getStaffById mutation implementation
  const getStaffByIdMutation = useMutation({
    mutationKey: ["getStaffById"],
    mutationFn: companyService.getStaffById,
    onSuccess: (response) => {
      console.log("Response from getStaffById:", response);

      // If response is empty, use the selectedStaff that was set before the API call
      if (!response || Object.keys(response).length === 0) {
        console.log("Using fallback staff data");
        // We already set selectedStaff in handleEditClick, so we can just proceed
        setShowAddForm(false);
        setShowEditForm(true);
        return;
      }

      // If we have a response with data property
      if (response.data) {
        const staffMember = response.data as StaffMember;
        setSelectedStaff(staffMember);
      } else {
        // If response has a different structure, try to use it directly
        // This handles cases where the API returns the staff object at the root level
        setSelectedStaff(response as unknown as StaffMember);
      }

      setShowAddForm(false);
      setShowEditForm(true);
    },
    onError: (error: any) => {
      console.log("Failed to fetch staff by ID:", error);
      toast.error(getErrorMessage(error));
      // Still show the edit form with the data we already have
      setShowEditForm(true);
    },
  });

  useEffect(() => {
    refetchStaff();
  }, [refetchStaff, showAddForm]);

  const resetForm = () => {
    form.reset({
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
    });
    setShowPermissionsSection(true);
  };

  // Update the handleEditClick function to use the getStaffById mutation
  const handleEditClick = (staffMember: any) => {
    if (
      inviteStaffMutation.isPending ||
      updateStaffMutation.isPending ||
      deleteStaffMutation.isPending ||
      getStaffByIdMutation.isPending
    )
      return;

    console.log("Fetching staff details for:", staffMember.staffId);

    // Set the selected staff member first as a fallback with all available data
    setSelectedStaff({
      ...staffMember,
      // Set default values for any missing properties
      email: staffMember.email || staffMember.user?.email || "",
      status:
        staffMember.status || (staffMember.active ? "active" : "inactive"),
      canAddProperty: staffMember.staffPermissions?.[0]?.canAddProperty ?? true,
      canPublishProperty:
        staffMember.staffPermissions?.[0]?.canPublishProperty ?? true,
      canFeatureProperty:
        staffMember.staffPermissions?.[0]?.canFeatureProperty ?? false,
      biography: staffMember.biography || "",
    });

    // Try to get more complete data from API
    getStaffByIdMutation.mutate(staffMember.staffId);
  };

  const handleDeleteClick = (staffMember: StaffMember) => {
    if (
      inviteStaffMutation.isPending ||
      updateStaffMutation.isPending ||
      deleteStaffMutation.isPending
    )
      return;

    setSelectedStaff(staffMember);
    setIsDeleteDialogOpen(true);
  };

  const handleAddStaff = async (data: z.infer<typeof staffFormSchema>) => {
    inviteStaffMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      phoneNumber: data.phoneNumber,
      languagesSpoken: data.languagesSpoken as any,
      status: data.status,
      canAddProperty: data.canAddProperty,
      canPublishProperty: data.canPublishProperty,
      canFeatureProperty: data.canFeatureProperty,
    });
  };

  const handleUpdateStaff = async (data: z.infer<typeof staffFormSchema>) => {
    if (!selectedStaff) return;
    updateStaffMutation.mutate(
      {
        id: selectedStaff.staffId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        phoneNumber: data.phoneNumber,
        languagesSpoken: data.languagesSpoken,
        status: data.status,
        canAddProperty: data.canAddProperty,
        canPublishProperty: data.canPublishProperty,
        canFeatureProperty: data.canFeatureProperty,
        biography: data.biography,
      },
      {
        onSuccess: () => {
          setShowEditForm(false);
        },
      }
    );
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;
    deleteStaffMutation.mutate(selectedStaff.staffId);
  };

  const handleCancelEdit = () => {
    if (!updateStaffMutation.isPending) {
      setShowEditForm(false);
      resetForm();
    }
  };

  const handleCloseDeleteDialog = (open: boolean) => {
    if (!deleteStaffMutation.isPending) {
      setIsDeleteDialogOpen(open);
    }
  };

  const handleToggleAddForm = () => {
    if (
      inviteStaffMutation.isPending ||
      updateStaffMutation.isPending ||
      deleteStaffMutation.isPending
    )
      return;

    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      resetForm();
    }
  };

  // Determine if any mutation is in progress
  const isSubmitting =
    inviteStaffMutation.isPending ||
    updateStaffMutation.isPending ||
    deleteStaffMutation.isPending ||
    getStaffByIdMutation.isPending;
  const isLoading = isLoadingStaff || isSubmitting;

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading}></Loader>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {t("title.accessManagement") || "Access Management"}
        </h1>
        <Button
          className="bg-primary text-white hover:bg-primary/90"
          onClick={() => {
            if (showEditForm) {
              setShowEditForm(false);
              resetForm();
            } else {
              setShowAddForm(!showAddForm);
              if (showAddForm) {
                resetForm();
              }
            }
          }}
          disabled={isSubmitting}
        >
          {showAddForm || showEditForm ? (
            t("button.cancel") || "Cancel"
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />{" "}
              {t("button.addNewAgent") || "Add New Agent"}
            </>
          )}
        </Button>
      </div>

      {/* Company Agents Section */}
      <div className="bg-white rounded-md shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("title.companyAgents") || "Company Agents"}
          </h2>

          {showAddForm ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddStaff)}
                className="space-y-6"
              >
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
                                t("form.firstName.placeholder") ||
                                "Enter first name"
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
                                t("form.lastName.placeholder") ||
                                "Enter last name"
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
                                t("form.email.placeholder") ||
                                "email@example.com"
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
                          <FormLabel>
                            {t("form.role.label") || "Role"}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                                t("form.phoneNumber.placeholder") ||
                                "+972 0000 0000"
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
                          <FormLabel>
                            {t("form.status.label") || "Status"}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    t("form.status.placeholder") ||
                                    "Select status"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">
                                {t("form.status.options.active") || "Active"}
                              </SelectItem>
                              <SelectItem value="inactive">
                                {t("form.status.options.inactive") ||
                                  "Inactive"}
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
                                {t("form.languages.options.english") ||
                                  "English"}
                              </SelectItem>
                              <SelectItem value="Arabic">
                                {t("form.languages.options.arabic") || "Arabic"}
                              </SelectItem>
                              <SelectItem value="English & Arabic">
                                {t("form.languages.options.both") ||
                                  "English & Arabic"}
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
                      <h3 className="text-sm font-medium">
                        {t("title.permissionsAccess") || "Permissions & Access"}
                      </h3>
                      <span className="text-xs text-right">
                        {t("title.permissions") || "Permissions"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="canAddProperty"
                        render={({ field }) => (
                          <div className="flex justify-between items-center">
                            <label htmlFor="canAddProperty" className="text-sm">
                              {t("form.permissions.canPostListings") ||
                                "Can Post Listings"}
                            </label>
                            <FormControl>
                              <Switch
                                id="canAddProperty"
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
                              htmlFor="canPublishProperty"
                              className="text-sm"
                            >
                              {t("form.permissions.requiresApproval") ||
                                "Requires Approval for Listings"}
                            </label>
                            <FormControl>
                              <Switch
                                id="canPublishProperty"
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
                              htmlFor="canFeatureProperty"
                              className="text-sm"
                            >
                              {t("form.permissions.canFeatureProperty") ||
                                "Can Feature Property"}
                            </label>
                            <FormControl>
                              <Switch
                                id="canFeatureProperty"
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
                    onClick={handleToggleAddForm}
                    disabled={isLoading || isSubmitting}
                  >
                    {t("button.cancel") || "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary"
                    disabled={isLoading || isSubmitting}
                  >
                    {inviteStaffMutation.isPending
                      ? t("button.inviting") || "Inviting..."
                      : t("button.invite") || "Invite"}
                  </Button>
                </div>
              </form>
            </Form>
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
            <StaffTable
              staff={staff}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Delete Agent Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("title.deleteAgent") || "Delete Agent"}
            </DialogTitle>
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
              {deleteStaffMutation.isPending
                ? t("button.deleting") || "Deleting..."
                : t("button.delete") || "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
