"use client";

import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { authService } from "@/services/public/auth";

export default function CompanyResetPasswordPage() {
  const t = useTranslations();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <ResetPasswordForm
        t={t}
        token={token}
        email={email}
        redirectPath={`/${locale}/customer/login`}
        authService={authService}
      />
    </div>
  );
}
