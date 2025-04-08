"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { AuthContainer } from "@/components/auth/auth-container";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { authService } from "@/services/public/auth";

export default function CompanyForgotPasswordPage() {
  const t = useTranslations();
  const { locale } = useParams();

  return (
    <AuthContainer
      title={t("title.forgotPasswordTitle")}
      subtitle={t("text.forgotPasswordText")}
    >
      <ForgotPasswordForm
        t={t}
        redirectPath={`/${locale}/customer/verification-reset`}
        authService={authService}
      />
    </AuthContainer>
  );
}
