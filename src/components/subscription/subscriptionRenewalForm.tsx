"use client";

import { StripeCardForm } from "@/components/stripe/stripeCardForm";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculateRemainingDays, cn } from "@/utils/utils";
import { ArrowLeft, BanknoteIcon, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/useAuth";
import { Switch } from "../ui/switch";
import { companyService } from "@/services/protected/company";
import { toast } from "sonner";

interface SubscriptionRenewalFormProps {
  onCancel: () => void;
  subscription: any;
  user: any;
}

// Define the billing details interface to match the one in StripeCardForm
interface BillingDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    country: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
}

export function SubscriptionRenewalForm({
  onCancel,
  subscription,
  user
}: SubscriptionRenewalFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [developmentMode, setDevelopmentMode] = useState(false);
  const t = useTranslations();

  const handleCardPaymentSubmit = async (
    paymentMethodId: string,
    billingDetails: BillingDetails
  ) => {
    if (!paymentMethodId) {
      setPaymentError("Invalid payment method");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Use a nonce or CSRF token for additional security
      const csrfToken = await fetchCsrfToken();

      // Create a unique idempotency key to prevent duplicate charges
      const idempotencyKey = `renewal-${user?.userId || ""
        }-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          paymentMethodId,
          amount: 200,
          idempotencyKey,
          userId: user?.userId,
          billingDetails,
          metadata: {
            subscriptionType: "renewal",
            userId: user?.userId,
            userEmail: user?.email,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Payment failed with status: ${response.status}`
        );
      }

      const result = await response.json();
      if (result.success) {
        setPaymentSuccess(true);
        setPaymentError(null);
      } else {
        setPaymentError(result.error || "Payment failed");
        setPaymentSuccess(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : "An error occurred during payment processing. Please try again."
      );
      setPaymentSuccess(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to fetch CSRF token
  const fetchCsrfToken = async (): Promise<string> => {
    try {
      const response = await fetch("/api/csrf-token");
      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      return "";
    }
  };

  const handleBankTransfer = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Record the bank transfer intent in your system
      const response = await fetch("/api/bank-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 200,
          reference: user?.email || t("yourAccountEmail"),
          userId: user?.userId,
          metadata: {
            subscriptionType: "renewal",
            userId: user?.userId,
            userEmail: user?.email,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setPaymentSuccess(true);
      } else {
        setPaymentError(result.error || "Failed to record bank transfer");
      }
    } catch (err) {
      console.error("Bank transfer error:", err);
      setPaymentError("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // companyService.renewSubscription

  const handleRenewSubscription = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      await companyService.renewSubscription();
      toast.success(t("subscriptionRenewedSuccessfully"));
    } catch (err) {
      console.error("Renew subscription error:", err);
      setPaymentError("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="w-full">
      <Separator />
      <CardHeader className="flex justify-between items-center px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <div>
            <div className="flex items-center">
              <CardTitle className="text-xl font-bold">{t("subscriptionRenewal")}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">{t("reviewAndUpdatePayment")}</p>
          </div>
          <div>
            <Button
              variant="default"
              size="sm"
              onClick={onCancel}
              type="button"
              aria-label={t("back")}
            >
              {t("subscriptionPlan")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 space-y-6">
        <div className="space-y-2 -mt-3">
          <div className="flex items-center justify-between gap-2 rounded border p-4">
            <div className="flex-3">
              <h3 className="text-base font-medium">{t("subscriptionPlan")}</h3>
              <p className="text-sm text-muted-foreground">{t("autoRenewalMessage")}</p>
            </div>
            <div className="flex-1.5 text-xl sm:text-2xl font-bold text-primary">
              <span>{calculateRemainingDays(user?.company?.subscriptionEndDate)}</span> <span className="text-sm font-normal w-full">/ {t("remainingDays")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="developmentMode">Development Mode</Label>
          <Switch id="developmentMode" checked={developmentMode} onCheckedChange={() => setDevelopmentMode(!developmentMode)} />
        </div>

        {developmentMode ?
          <>
            <Button onClick={handleRenewSubscription} variant="outline">
              Renew Subscription 🔁
            </Button>
          </>
          :
          <div className="space-y-4">
            <h3 className="text-base font-medium">{t("paymentDetails")}</h3>
            <RadioGroup
              defaultValue={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-2 gap-3 w-full max-w-[400px]"
              disabled={isProcessing}
            >
              <Label
                htmlFor="card"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  paymentMethod === "card" ? "border-primary" : "border-muted",
                  isProcessing && "opacity-50 cursor-not-allowed"
                )}
              >
                <RadioGroupItem value="card" id="card" className="sr-only" />
                <CreditCard className="mb-2 h-6 w-6" />
                <span>{t("card")}</span>
              </Label>

              <Label
                htmlFor="bank"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  paymentMethod === "bank" ? "border-primary" : "border-muted",
                  isProcessing && "opacity-50 cursor-not-allowed"
                )}
              >
                <RadioGroupItem value="bank" id="bank" className="sr-only" />
                <BanknoteIcon className="mb-2 h-6 w-6" />
                <span>{t("bankTransfer")}</span>
              </Label>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="space-y-4 pt-2">
                <StripeCardForm onSubmit={handleCardPaymentSubmit} amount={200} />
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="space-y-4 pt-2">
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 mb-2 sm:mb-0">
                      <BanknoteIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="sm:ml-3">
                      <h3 className="text-sm font-medium text-primary">{t("bankTransferInfo")}</h3>
                      <div className="mt-2 text-sm text-primary">
                        <p>{t("bankTransferInstructions")}</p>
                        <p>{t("bankName")}: National Bank</p>
                        <p>{t("accountName")}: Property Explorer LLC</p>
                        {/* Don't display full account numbers in the UI */}
                        <p>{t("accountNumber")}: ****7890</p>
                        <p className="break-words">IBAN: AE12********78901</p>
                        <p>
                          {t("reference")}: {user?.email || t("yourAccountEmail")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>}
        {paymentError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{paymentError}</p>
          </div>
        )}
        {paymentSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{t("paymentSuccessful")}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 border-t bg-muted/50 px-4 sm:px-6 py-4">

        {paymentMethod === "bank" && (
          <Button
            onClick={handleBankTransfer}
            className="w-full sm:w-auto order-1 sm:order-2"
            type="button"
            disabled={isProcessing}
          >
            {isProcessing ? t("processing") : t("payNow")}
          </Button>
        )}
      </CardFooter>
    </div>
  )
}
