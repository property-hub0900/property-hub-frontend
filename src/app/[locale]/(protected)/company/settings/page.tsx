"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalSettingsForm } from "@/components/settings-company/personalSettingsForm";
import { CompanySettingsForm } from "@/components/settings-company/companySettingsForm";
import { companyService } from "@/services/protected/company";
import { Loader } from "@/components/loader";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { PERMISSIONS } from "@/constants/rbac";
import { useRBAC } from "@/lib/hooks/useRBAC";
import { ChangePassword } from "@/components/change-password";
import { Separator } from "@/components/ui/separator";
export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("personal-details");
  const t = useTranslations();
  const { hasPermission } = useRBAC()

  // Refs to access form methods from child components
  const personalFormRef = useRef<any>(null);
  const companyFormRef = useRef<any>(null);
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await companyService.getMe();
      setUserData(response.data || response);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "personal-details" && personalFormRef.current) {
        await personalFormRef.current.submit();
      } else if (activeTab === "company-details" && companyFormRef.current) {
        await companyFormRef.current.submit();
      }
      fetchUserData();
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (activeTab === "personal-details" && personalFormRef.current) {
      personalFormRef.current.reset();
    } else if (activeTab === "company-details" && companyFormRef.current) {
      companyFormRef.current.reset();
    }
  };

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading} />

      {hasPermission(PERMISSIONS.EDIT_COMPANY) && (<h1 className="text-2xl font-bold">
        {t("title.companySettings")}
      </h1>)}

      <Tabs
        defaultValue="personal-details"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="mb-1">
          <TabsTrigger value="personal-details">
            {t("title.personalDetails")}
          </TabsTrigger>
          {hasPermission(PERMISSIONS.EDIT_COMPANY) && <TabsTrigger value="company-details">
            {t("title.companyDetails")}
          </TabsTrigger>}
        </TabsList>

        <TabsContent
          value="personal-details"
          className="bg-white rounded-md shadow"
        >
          {userData && (
            <PersonalSettingsForm userData={userData} ref={personalFormRef} />

          )}

        </TabsContent>

        <TabsContent
          value="company-details"
          className="bg-white rounded-md shadow"
        >
          {userData && (
            <CompanySettingsForm userData={userData} ref={companyFormRef} />
          )}
        </TabsContent>
      </Tabs>

      {/* Save and Cancel buttons at the page level */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading || isSaving}
        >
          {t("button.cancel")}
        </Button>
        <Button
          onClick={handleSave}
          disabled={personalFormRef.current?.isDirty?.() || companyFormRef.current?.isDirty?.()}
        >
          {isSaving ? t("button.saving") : t("button.save")}
        </Button>
      </div>

      {activeTab === "personal-details" && (
        <>
          <Separator className="my-2" />
          <div className="mt-10">
            <h6 className="-mb-12 ml-12">{t("title.changePassword")}</h6>
          </div>
          <ChangePassword padding="p-14" company={true} />

          <Separator className="my-10" />
        </>
      )}
    </div>
  );
}
