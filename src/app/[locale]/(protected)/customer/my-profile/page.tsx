"use client";

import { useQuery } from "@tanstack/react-query";
import { EditProfile } from "./components/edit-profile";
import { customerService } from "@/services/protected/customer";

import { useTranslations } from "next-intl";
import { Loader } from "@/components/loader";
import { Separator } from "@/components/ui/separator";
import { ChangePassword } from "@/components/change-password";

export default function Page() {
  const t = useTranslations();

  const { data: profileData, isLoading: isLoadingProfileData } = useQuery({
    queryKey: ["customerProfileGetMe"],
    queryFn: () => customerService.getMe(),
  });

  return (
    <div>
      <Loader isLoading={isLoadingProfileData} />
      <h3 className="mb-3">{t("title.myProfile")}</h3>
      {profileData && <EditProfile customer={profileData} />}
      <Separator className="my-10" />
      <ChangePassword />
    </div>
  );
}
