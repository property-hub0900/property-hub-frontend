"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { CreditCardIcon as Card } from "lucide-react"
import { CreditCard } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TopUpFormProps {
  onCancel: () => void
  plans?: any[]
}

// Default point options if API doesn't return any
const defaultPointOptions = [
  { value: 10, price: 1550 },
  { value: 20, price: 3000 },
  { value: 25, price: 3750 },
  { value: 30, price: 4500 },
  { value: 35, price: 5250 },
]

export function TopUpForm({ onCancel, plans = [] }: TopUpFormProps) {
  // Always declare all hooks at the top level
  const t = useTranslations("topUpSubscription")
  const countries = useTranslations("countries")

  // Move this calculation outside of the component or memoize it
  const pointOptions =
    plans && plans.length > 0 ? plans.map((plan) => ({ value: plan.points, price: plan.price })) : defaultPointOptions

  // Initialize state with default values that don't depend on props or calculations
  const [selectedPoints, setSelectedPoints] = useState(10)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    country: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update selected points after component mounts and when plans change
  useEffect(() => {
    if (pointOptions && pointOptions.length > 0) {
      setSelectedPoints(pointOptions[0].value)
    }
  }, [plans]) // Only depend on plans, not pointOptions

  const handlePointSelection = (points: number) => {
    setSelectedPoints(points)
  }

  const handleCardDetailsChange = (field: string, value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Handle successful payment
      toast.success(t("paymentSuccessful"))
      onCancel() // Return to history view
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error(t("paymentFailed"))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Find the selected option
  const selectedOption = pointOptions.find((option) => option.value === selectedPoints)
  const totalPrice = selectedOption ? selectedOption.price : 0

  return (
    <div className=" mx-auto px-4 sm:px-0">
      <h1 className="text-2xl font-bold tracking-tight mb-6">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Points Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">{t("topUpPoints")}</h2>
          <p className="text-sm text-muted-foreground">{t("selectPointsHelp")}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {pointOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition-all",
                  selectedPoints === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
                onClick={() => handlePointSelection(option.value)}
              >
                <span className="text-xl font-bold">{option.value}</span>
                <span className="text-xs text-muted-foreground">{t("points")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2 className="text-lg font-medium">{t("paymentMethods")}</h2>
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">{t("total")}</p>
              <p className="text-xl font-bold">QAR {totalPrice}</p>
            </div>
          </div>

          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md"
          >
            <div>
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex items-center gap-2 p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <CreditCard className="h-5 w-5" />
                <span>{t("card")}</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="sofort" id="sofort" className="peer sr-only" />
              <Label
                htmlFor="sofort"
                className="flex items-center gap-2 p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <Card className="h-5 w-5" />
                <span>{t("sofortKlarna")}</span>
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "card" ? (
            <div className="space-y-4 mt-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">{t("cardNumber")}</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="1234 1234 1234 1234"
                    value={cardDetails.cardNumber}
                    onChange={(e) => handleCardDetailsChange("cardNumber", e.target.value)}
                    className="pr-12"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Image src="/cards/visa.svg" alt="Visa" width={24} height={16} />
                    <Image src="/cards/mastercard.svg" alt="Mastercard" width={24} height={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">{t("expiration")}</Label>
                  <Input
                    id="expiry"
                    placeholder="MM / YY"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardDetailsChange("expiry", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvc">{t("cvc")}</Label>
                  <div className="relative">
                    <Input
                      id="cvc"
                      placeholder="CVC"
                      value={cardDetails.cvc}
                      onChange={(e) => handleCardDetailsChange("cvc", e.target.value)}
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">CVV</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t("country")}</Label>
                <Select
                  value={cardDetails.country}
                  onValueChange={(value) => handleCardDetailsChange("country", value)}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder={t("selectCountry")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qa">{countries("qatar")}</SelectItem>
                    <SelectItem value="ae">{countries("uae")}</SelectItem>
                    <SelectItem value="sa">{countries("saudiArabia")}</SelectItem>
                    <SelectItem value="kw">{countries("kuwait")}</SelectItem>
                    <SelectItem value="bh">{countries("bahrain")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="p-4 border rounded-md bg-blue-50 text-blue-800 max-w-md">
              <p>{t("sofortInstructions")}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              (paymentMethod === "card" &&
                (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.country))
            }
            className="w-full sm:w-auto"
          >
            {isSubmitting ? t("processing") : t("payNow")}
          </Button>
        </div>
      </form>
    </div>
  )
}

