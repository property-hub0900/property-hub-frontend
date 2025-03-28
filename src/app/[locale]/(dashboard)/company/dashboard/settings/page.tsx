"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalSettingsForm } from "@/components/settings-company/personalSettingsForm"
import { CompanySettingsForm } from "@/components/settings-company/companySettingsForm"
import { companyService } from "@/services/company"
import { Loader } from "@/components/loader"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [userData, setUserData] = useState<any>(null)
    const [activeTab, setActiveTab] = useState("personal-details")
    const t = useTranslations()

    // Refs to access form methods from child components
    const personalFormRef = useRef<any>(null)
    const companyFormRef = useRef<any>(null)
    const fetchUserData = async () => {
        try {
            setIsLoading(true)
            const response = await companyService.getMe()
            setUserData(response.data || response)
        } catch (error) {
            console.error("Failed to fetch user data:", error)
            toast.error(getErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchUserData()
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {

            if (activeTab === "personal-details" && personalFormRef.current) {
                await personalFormRef.current.submit()
            } else if (activeTab === "company-details" && companyFormRef.current) {
                await companyFormRef.current.submit()
            }
            fetchUserData()
        } catch (error) {
            console.error("Failed to save settings:", error)
            toast.error(getErrorMessage(error))
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        if (activeTab === "personal-details" && personalFormRef.current) {
            personalFormRef.current.reset()
        } else if (activeTab === "company-details" && companyFormRef.current) {
            companyFormRef.current.reset()
        }
    }

    return (
        <div className="space-y-6">
            <Loader isLoading={isLoading} />

            <h1 className="text-2xl font-bold">{t("title.companySettings") || "Company Settings"}</h1>

            <Tabs defaultValue="personal-details" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <TabsList className="mb-1">
                    <TabsTrigger value="personal-details">{t("tabs.personalDetails") || "Personal Details"}</TabsTrigger>
                    <TabsTrigger value="company-details">{t("tabs.companyDetails") || "Company Details"}</TabsTrigger>
                </TabsList>

                <TabsContent value="personal-details" className="bg-white rounded-md shadow">
                    {userData && <PersonalSettingsForm userData={userData} ref={personalFormRef} />}
                </TabsContent>

                <TabsContent value="company-details" className="bg-white rounded-md shadow">
                    {userData && <CompanySettingsForm userData={userData} ref={companyFormRef} />}
                </TabsContent>
            </Tabs>

            {/* Save and Cancel buttons at the page level */}
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={isLoading || isSaving}>
                    {t("button.cancel") || "Cancel"}
                </Button>
                <Button onClick={handleSave} disabled={isLoading || isSaving}>
                    {isSaving ? "Saving..." : t("button.save") || "Save"}
                </Button>
            </div>
        </div>
    )
}

