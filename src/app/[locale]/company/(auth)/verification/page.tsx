"use client"

import { useTranslations } from "next-intl"
import { AuthContainer } from "@/components/auth/auth-container"
import { useParams, useSearchParams } from "next/navigation"
import { VerificationForm } from "@/components/auth/verification-form"

export default function CompanyVerificationPage() {
  const t = useTranslations("verificationPage")
  const { locale } = useParams()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  return (
    <AuthContainer title={t("verifyAccount")} subtitle={t("enterOtpSent")}>
      <VerificationForm email={email} redirectPath={`/${locale}/company/login`} t={t} />
    </AuthContainer>
  )
}

