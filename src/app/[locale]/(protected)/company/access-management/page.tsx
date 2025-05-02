"use client";

import { DeleteDialog } from "@/components/delete-dailog";
import { Loader } from "@/components/loader";
import { AddStaffForm } from "@/components/staff/addStaffForm";
import { EditUserForm } from "@/components/staff/editUserForm";
import { StaffTable } from "@/components/staffTable";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";
import { NAVIGATION_EVENTS, navigationEvents } from "@/lib/navigation-events";
import type { staffFormSchema } from "@/schema/protected/company";
import { companyService, type StaffMember } from "@/services/protected/company";
import { getErrorMessage } from "@/utils/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type * as z from "zod";

type ViewType = "default" | "add" | "edit" | "delete";

export default function AccessManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const { hasPermission } = useRBAC();

  // State management
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [view, setView] = useState<ViewType>(
    (searchParams.get("view") as ViewType) || "default"
  );

  // Track last processed idParam to avoid duplicate mutations
  const lastProcessedIdRef = useRef<string | null>(null);

  // Fetch staff data
  const { isLoading: isLoadingStaff, refetch: refetchStaff } = useQuery({
    queryKey: ["getAllStaff"],
    queryFn: async () => {
      try {
        const response: any = await companyService.getAllStaff();
        const staffData = response.data || response.results || [];
        setStaff(staffData as StaffMember[]);
        return response;
      } catch (error: any) {
        toast.error(getErrorMessage(error));
        throw error;
      }
    },
  });

  // Invite staff mutation
  const inviteStaffMutation = useMutation({
    mutationKey: ["inviteStaff"],
    mutationFn: companyService.inviteStaff,
    onSuccess: (response, variables) => {
      const newStaffMember: StaffMember = {
        ...(response.data as StaffMember),
        languagesSpoken: variables.languagesSpoken || "English & Arabic",
        status: variables.status || ("active" as any),
      };
      setStaff([...staff, newStaffMember]);
      toast.success(response.message);
      handleViewChange("default");
      refetchStaff();
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Update staff mutation
  const updateStaffMutation = useMutation({
    mutationKey: ["updateStaff"],
    mutationFn: companyService.updateStaff,
    onSuccess: (response, variables) => {
      const updatedStaffMember: StaffMember = {
        ...(response.data as StaffMember),
        languagesSpoken: variables.languagesSpoken ?? "English",
      };
      const updatedStaffList = staff.map((s) =>
        s.id === selectedStaff?.id ? updatedStaffMember : s
      );
      setStaff(updatedStaffList);
      toast.success(response.message);
      handleViewChange("default");
      refetchStaff();
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Delete staff mutation
  const deleteStaffMutation = useMutation({
    mutationKey: ["deleteStaff"],
    mutationFn: (staffId: string) => companyService.deleteStaff(staffId),
    onSuccess: (response) => {
      if (selectedStaff) {
        const updatedStaff = staff.filter((s) => s.staffId !== selectedStaff.staffId);
        setStaff(updatedStaff);
      }
      toast.success(response.message);
      setIsDeleteDialogOpen(false);
      handleViewChange("default");
      refetchStaff();
    },
    onError: (error: any) => {
      toast.error(t("text.deleteFailed"));
    },
  });

  // Get staff by ID mutation
  const getStaffByIdMutation = useMutation({
    mutationKey: ["getStaffById", selectedStaff?.staffId],
    mutationFn: companyService.getStaffById,
    onSuccess: (response) => {
      if (!response || Object.keys(response).length === 0) {
        setView("edit");
        return;
      }
      const staffMember = response.data || response;
      setSelectedStaff(staffMember as StaffMember);
      setView("edit");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      setView("edit"); // Fallback to edit form with existing selectedStaff
    },
  });

  // Handle view changes and update URL
  const handleViewChange = (newView: ViewType, staffId?: string) => {
    setView(newView);
    setSelectedStaff(null); // Reset selected staff unless editing
    const params = new URLSearchParams(searchParams);
    if (newView === "default") {
      params.delete("view");
      params.delete("id");
    } else {
      params.set("view", newView);
      if (staffId && newView === "edit") {
        params.set("id", staffId);
      } else {
        params.delete("id");
      }
    }
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  // Initialize state based on URL params
  useEffect(() => {
    const viewParam = searchParams.get("view") as ViewType;
    const idParam = searchParams.get("id");

    if (viewParam && viewParam !== "default") {
      setView(viewParam);
      if (viewParam === "edit" && idParam && idParam !== lastProcessedIdRef.current) {
        // Update last processed ID
        lastProcessedIdRef.current = idParam;

        // Set fallback from local staff array
        const staffMember = staff.find((s) => s.staffId === idParam);
        if (staffMember) {
          setSelectedStaff(staffMember);
        }

        // Trigger mutation to fetch fresh data
        getStaffByIdMutation.mutate(idParam);
      }
    } else if (!viewParam) {
      setView("default");
      setSelectedStaff(null);
      lastProcessedIdRef.current = null; // Reset ref when returning to default
    }
  }, [searchParams, staff]); // Removed getStaffByIdMutation from dependencies

  // Reset page state on navigation event
  useEffect(() => {
    const unsubscribe = navigationEvents.subscribe(
      NAVIGATION_EVENTS.RESET_ACCESS_MANAGEMENT,
      () => handleViewChange("default")
    );
    return unsubscribe;
  }, []);

  // Event handlers
  const handleAddStaff = (data: z.infer<typeof staffFormSchema>) => {
    inviteStaffMutation.mutate(data as any);
  };

  const handleUpdateStaff = (data: z.infer<typeof staffFormSchema>) => {
    if (!selectedStaff) return;
    updateStaffMutation.mutate({
      id: selectedStaff.staffId,
      ...(data as any),
    });
  };

  const handleDeleteStaff = () => {
    if (!selectedStaff) return;
    deleteStaffMutation.mutate(selectedStaff.staffId);
  };

  const handleEditClick = (staffMember: StaffMember) => {
    if (isSubmitting) return;
    setSelectedStaff({
      ...staffMember,
      email: staffMember.email ?? staffMember.user?.email ?? "",
      status: staffMember.status ?? (staffMember.active ? "active" : "inactive"),
      canAddProperty: staffMember.staffPermissions?.[0]?.canAddProperty ?? true,
      canPublishProperty: staffMember.staffPermissions?.[0]?.canPublishProperty ?? true,
      canFeatureProperty: staffMember.staffPermissions?.[0]?.canFeatureProperty ?? false,
      biography: staffMember.biography ?? "",
    });
    handleViewChange("edit", staffMember.staffId);
    getStaffByIdMutation.mutate(staffMember.staffId);
  };

  const handleDeleteClick = (staffMember: StaffMember) => {
    if (isSubmitting) return;
    setSelectedStaff(staffMember);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelEdit = () => {
    if (!updateStaffMutation.isPending) {
      handleViewChange("default");
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!deleteStaffMutation.isPending) {
      setIsDeleteDialogOpen(false);
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
      <Loader isLoading={isLoading} />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {view !== "default" && (
            <Button
              variant="ghost"
              className="p-0 mr-2"
              onClick={() => handleViewChange("default")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {t("title.accessManagement")}
        </h1>

        {view === "default" && hasPermission(PERMISSIONS.CREATE_USER) && (
          <Button
            onClick={() => handleViewChange("add")}
            disabled={isSubmitting}
          >
            {t("button.addNewAgent")}
          </Button>
        )}
      </div>

      <div className="bg-white rounded-md shadow">
        <div className="p-6">
          {view === "add" ? (
            <AddStaffForm
              onSubmit={handleAddStaff}
              onCancel={() => handleViewChange("default")}
              isSubmitting={inviteStaffMutation.isPending}
            />
          ) : view === "edit" && selectedStaff ? (
            <EditUserForm
              selectedStaff={selectedStaff}
              onSubmit={handleUpdateStaff}
              onCancel={handleCancelEdit}
              isSubmitting={updateStaffMutation.isPending}
            />
          ) : (
            <StaffTable
              staff={staff}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              title={t("title.companyAgents")}
            />
          )}
        </div>
      </div>

      <DeleteDialog
        title={t("title.deleteAgent")}
        deleteConfirmation={t("text.deleteAgentConfirmation")}
        isOpen={isDeleteDialogOpen}
        onOpenChange={handleCloseDeleteDialog}
        onDelete={handleDeleteStaff}
        isSubmitting={deleteStaffMutation.isPending}
      />
    </div>
  );
}