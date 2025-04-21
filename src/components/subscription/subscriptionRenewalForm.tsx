"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { uploadImageToFirebase } from "@/lib/firebaseUtil"
import { companyService } from "@/services/protected/company"
import { calculateRemainingDays, cn } from "@/utils/utils"
import { BanknoteIcon, CreditCard } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { Loader } from "../loader"
import { Switch } from "../ui/switch"

interface SubscriptionRenewalFormProps {
  onCancel: () => void
  subscription: any
  user: any
}

// Define the billing details interface to match the one in StripeCardForm
interface BillingDetails {
  name?: string
  email?: string
  phone?: string
  address?: {
    country: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal_code?: string
  }
}

export function SubscriptionRenewalForm({ onCancel, subscription, user }: SubscriptionRenewalFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [developmentMode, setDevelopmentMode] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState("")
  const [uploadError, setUploadError] = useState("")

  const t = useTranslations()

  // const handleCardPaymentSubmit = async (paymentMethodId: string, billingDetails: BillingDetails) => {
  //   if (!paymentMethodId) {
  //     setPaymentError("Invalid payment method")
  //     return
  //   }

  //   setIsProcessing(true)
  //   setPaymentError(null)

  //   try {
  //     // Use a nonce or CSRF token for additional security
  //     const csrfToken = await fetchCsrfToken()

  //     // Create a unique idempotency key to prevent duplicate charges
  //     const idempotencyKey = `renewal-${user?.userId || ""
  //       }-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

  //     const response = await fetch("/api/payment", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-CSRF-Token": csrfToken,
  //       },
  //       body: JSON.stringify({
  //         paymentMethodId,
  //         amount: 200,
  //         idempotencyKey,
  //         userId: user?.userId,
  //         billingDetails,
  //         metadata: {
  //           subscriptionType: "renewal",
  //           userId: user?.userId,
  //           userEmail: user?.email,
  //         },
  //       }),
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}))
  //       throw new Error(errorData.message || `Payment failed with status: ${response.status}`)
  //     }

  //     const result = await response.json()
  //     if (result.success) {
  //       setPaymentSuccess(true)
  //       setPaymentError(null)
  //     } else {
  //       setPaymentError(result.error || "Payment failed")
  //       setPaymentSuccess(false)
  //     }
  //   } catch (err) {
  //     console.error("Payment error:", err)
  //     setPaymentError(
  //       typeof err === "object" && err !== null && "message" in err
  //         ? String(err.message)
  //         : "An error occurred during payment processing. Please try again.",
  //     )
  //     setPaymentSuccess(false)
  //   } finally {
  //     setIsProcessing(false)
  //   }
  // }

  // Function to fetch CSRF token
  // const fetchCsrfToken = async (): Promise<string> => {
  //   try {
  //     const response = await fetch("/api/csrf-token")
  //     const data = await response.json()
  //     return data.csrfToken
  //   } catch (error) {
  //     console.error("Failed to fetch CSRF token:", error)
  //     return ""
  //   }
  // }


  const handleRenewSubscription = async () => {
    setIsProcessing(true)
    setPaymentError(null)

    try {
      await companyService.renewSubscription({
        paymentMethod: paymentMethod === "card" ? paymentMethod : "banktransfer",
        image: uploadedFileUrl ? uploadedFileUrl : null,
      })
      toast.success(t("subscriptionRenewedSuccessfully"))
    } catch (err) {
      console.error("Renew subscription error:", err)
      setPaymentError("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Reset states
    setUploadError("")
    setIsUploading(true)
    setUploadedFile(file)

    try {
      const downloadURL = await uploadImageToFirebase(file)
      setUploadedFileUrl(downloadURL)
      setIsUploading(false)
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadError(t("uploadError") || "Failed to upload file. Please try again.")
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full">
      <Loader isLoading={isUploading} />
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
            <Button variant="default" size="sm" onClick={onCancel} type="button" aria-label={t("back")}>
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
              <span>{calculateRemainingDays(user?.company?.subscriptionEndDate)}</span>{" "}
              <span className="text-sm font-normal w-full">/ {t("remainingDays")}</span>
            </div>
          </div>
        </div>

        {paymentMethod === 'card' && <div className="flex items-center gap-2">
          <Label htmlFor="developmentMode">Development Mode</Label>
          <Switch
            id="developmentMode"
            checked={developmentMode}
            onCheckedChange={() => setDevelopmentMode(!developmentMode)}
          />
        </div>}

        {developmentMode ? (
          <>
            <Button onClick={handleRenewSubscription} variant="outline">
              Renew Subscription 🔁
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-base font-medium">{t("paymentDetails")}</h3>
            <RadioGroup
              defaultValue={paymentMethod}
              onValueChange={(value) => {
                setUploadedFile(null)
                setUploadedFileUrl("")
                setPaymentMethod(value)
              }}
              className="grid grid-cols-2 gap-3 w-full max-w-[400px]"
              disabled={isProcessing}
            >
              <Label
                htmlFor="card"
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  paymentMethod === "card" ? "border-primary" : "border-muted",
                  isProcessing && "opacity-50 cursor-not-allowed",
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
                  isProcessing && "opacity-50 cursor-not-allowed",
                )}
              >
                <RadioGroupItem value="bank" id="bank" className="sr-only" />
                <BanknoteIcon className="mb-2 h-6 w-6" />
                <span>{t("bankTransfer")}</span>
              </Label>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="space-y-4 pt-2">
                {/* <StripeCardForm onSubmit={handleCardPaymentSubmit} amount={200} /> */}
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

                <div className="rounded-md border border-gray-200 p-4">
                  <div className="flex flex-col space-y-3">
                    <h3 className="text-sm font-medium">{t("attachScreenshot") || "Attach Screenshot"}</h3>
                    <p className="text-sm text-gray-500">{t("bankReceiptSlip") || "Bank Receipt/Slip"}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 truncate">
                        {uploadedFile && <p className="text-sm truncate">{uploadedFile?.name}</p>}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="receipt-upload"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                        <Button variant="default" size="sm" className="pointer-events-none" disabled={isUploading}>

                          <span>{t("browseFile") || "Browse File"}</span>

                        </Button>
                      </div>
                    </div>

                    {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

                    {uploadedFileUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600 mb-2">
                          {t("uploadSuccess") || "File uploaded successfully"}
                        </p>
                        <div className="border rounded-md overflow-hidden max-w-xs">
                          <img
                            src={uploadedFileUrl || "/placeholder.svg"}
                            alt={t("receiptPreview") || "Receipt preview"}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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
      <CardFooter className="flex justify-end sm:flex-row gap-3 border-t bg-muted/50 px-4 sm:px-6 py-4">
        {paymentMethod === "bank" && (
          <>
            <Button
              onClick={handleRenewSubscription}
              className="w-full sm:w-auto order-1 sm:order-2"
              type="button"
              disabled={isProcessing || uploadedFileUrl === ""}
            >
              {isProcessing ? t("processing") : t("button.submit")}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              {t("button.cancel")}
            </Button>
          </>
        )}
      </CardFooter>
    </div>
  )
}
