"use client";

import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { authService } from "@/services/public/auth";
import { AuthContainer } from "@/components/auth/auth-container";

export default function CompanyResetPasswordPage() {
  const t = useTranslations();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  return (
    <AuthContainer
      title={t("title.createNewPassword")}
      subtitle={t("text.enterNewPassword")}
    >
      <ResetPasswordForm
        t={t}
        token={token}
        email={email}
        redirectPath={`/${locale}/company/login`}
        authService={authService}
      />
    </AuthContainer>
  );
}
