"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { companyService } from "@/services/protected/company";
import { cn, groupByThreeDigits } from "@/utils/utils";
import { ArrowLeftIcon, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "./dialog";

// Define Props Interface
interface TopUpFormProps {
  onCancel: () => void;
  onComplete: () => void;
  plans?: { topupId: string; points: number; price: number }[];
}

// Payment method type
type PaymentMethod = "card" | "sales-team";

// Default point options if API doesn't return any
const defaultPointOptions = [
  { value: 10, price: 1550 },
  { value: 20, price: 3000 },
  { value: 25, price: 3750 },
  { value: 30, price: 4500 },
  { value: 35, price: 5250 },
];

// SVG Component for Contact Sales Team Icon
const ContactSalesIcon = ({ isSelected }: { isSelected: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.3718 10.3473C11.6837 10.1344 12.0495 10.014 12.4269 10.0003C12.8043 9.98654 13.1778 10.0799 13.5044 10.2696C13.8309 10.4593 14.0971 10.7376 14.2721 11.0722C14.447 11.4069 14.5237 11.7843 14.4932 12.1607C13.6933 12.4402 12.8437 12.549 11.9992 12.48C11.9966 11.7244 11.779 10.9845 11.3718 10.348C11.0104 9.78119 10.5119 9.31469 9.9224 8.99167C9.33287 8.66865 8.6714 8.49954 7.99918 8.5C7.32707 8.49966 6.66573 8.66881 6.07633 8.99183C5.48693 9.31485 4.98851 9.78129 4.62718 10.348M11.9985 12.4793L11.9992 12.5C11.9992 12.65 11.9912 12.798 11.9745 12.944C10.7648 13.6381 9.3939 14.0022 7.99918 14C6.55251 14 5.19451 13.616 4.02384 12.944C4.0067 12.7897 3.99847 12.6346 3.99918 12.4793M3.99918 12.4793C3.15493 12.5508 2.30578 12.4425 1.50651 12.1613C1.47608 11.785 1.55277 11.4078 1.72773 11.0733C1.90268 10.7387 2.16876 10.4605 2.49518 10.2709C2.8216 10.0812 3.19504 9.98777 3.57232 10.0014C3.9496 10.0151 4.31532 10.1352 4.62718 10.348M3.99918 12.4793C4.00157 11.7238 4.22026 10.9846 4.62718 10.348M9.99918 4.5C9.99918 5.03043 9.78846 5.53914 9.41339 5.91421C9.03832 6.28929 8.52961 6.5 7.99918 6.5C7.46874 6.5 6.96004 6.28929 6.58496 5.91421C6.20989 5.53914 5.99918 5.03043 5.99918 4.5C5.99918 3.96957 6.20989 3.46086 6.58496 3.08579C6.96004 2.71071 7.46874 2.5 7.99918 2.5C8.52961 2.5 9.03832 2.71071 9.41339 3.08579C9.78846 3.46086 9.99918 3.96957 9.99918 4.5ZM13.9992 6.5C13.9992 6.69698 13.9604 6.89204 13.885 7.07403C13.8096 7.25601 13.6991 7.42137 13.5598 7.56066C13.4205 7.69995 13.2552 7.81044 13.0732 7.88582C12.8912 7.9612 12.6962 8 12.4992 8C12.3022 8 12.1071 7.9612 11.9252 7.88582C11.7432 7.81044 11.5778 7.69995 11.4385 7.56066C11.4385 7.56066 11.4385 7.56066 11.4385 7.56066C11.2992 7.42137 11.1887 7.25601 11.1134 7.07403C11.038 6.89204 10.9992 6.69698 10.9992 6.5C10.9992 6.10218 11.1572 5.72064 11.4385 5.43934C11.7198 5.15804 12.1014 5 12.4992 5C12.897 5 13.2785 5.15804 13.5598 5.43934C13.8411 5.72064 13.9992 6.10218 13.9992 6.5ZM4.99918 6.5C4.99918 6.69698 4.96038 6.89204 4.885 7.07403C4.80961 7.25601 4.69912 7.42137 4.55984 7.56066C4.42055 7.69995 4.25519 7.81044 4.0732 7.88582C3.89121 7.9612 3.69616 8 3.49918 8C3.30219 8 3.10714 7.9612 2.92515 7.88582C2.74316 7.81044 2.5778 7.69995 2.43852 7.56066C2.29923 7.42137 2.18874 7.25601 2.11336 7.07403C2.03797 6.89204 1.99918 6.69698 1.99918 6.5C1.99918 6.10218 2.15721 5.72064 2.43852 5.43934C2.71982 5.15804 3.10135 5 3.49918 5C3.897 5 4.27853 5.15804 4.55984 5.43934C4.84114 5.72064 4.99918 6.10218 4.99918 6.5Z"
      stroke={isSelected ? "rgba(74, 160, 217, 1)" : "gray"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * A form component for topping up points with payment options.
 * Supports card payments or contacting the sales team, with a confirmation dialog for card purchases only.
 */
export function TopUpForm({ onCancel, onComplete, plans = [] }: TopUpFormProps) {
  const t = useTranslations("topUpSubscription");
  const countries = useTranslations("countries");

  // State Declarations
  const [developmentMode, setDevelopmentMode] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<{ id?: string; value: number; price: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  // Compute point options based on plans - memoized to prevent unnecessary recalculations
  const pointOptions = useMemo(() =>
    plans.length > 0
      ? plans.map((plan) => ({
        id: plan.topupId,
        value: plan.points,
        price: plan.price,
      }))
      : defaultPointOptions,
    [plans]
  );

  // Set default selected points when component mounts or plans change
  useEffect(() => {
    if (pointOptions && pointOptions.length > 0) {
      setSelectedPoints(pointOptions[0]);
    }
  }, [plans]); // Only depend on plans, not pointOptions

  // Event Handlers
  const handlePointSelection = (option: typeof selectedPoints) => {
    setSelectedPoints(option);
  };

  const handleCardDetailsChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePurchaseTopUp = async () => {
    if (!selectedPoints) return;

    setIsSubmitting(true);
    try {
      await companyService.purchaseTopUp({
        topupId: selectedPoints.id,
        points: selectedPoints.value,
        paymentMethod: paymentMethod === "card" ? paymentMethod : "sales-team",
        email,
        phone,
        message,
      });

      // Only show success toast for card payments
      if (paymentMethod === "card") {
        toast.success(t("purchaseTopUpSuccess"));
      } else if (paymentMethod === "sales-team") {
        toast.success(t("purchaseTopUpSuccessSalesTeam"));
      }

      // Reset form and notify parent
      resetForm();
      onComplete();
    } catch (error) {
      console.error("Purchase Top Up failed:", error);
      toast.error(t("purchaseTopUpFailed"));
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setDevelopmentMode(false);
    setPaymentMethod("card");
    setEmail("");
    setPhone("");
    setMessage("");
    setCardDetails({
      cardNumber: "",
      expiry: "",
      cvc: "",
      country: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // For card payments, show confirmation dialog first
    if (paymentMethod === "card") {
      setShowConfirmDialog(true);
      return;
    }

    // For sales team contact, process immediately without confirmation dialog
    handlePurchaseTopUp();
  };

  // Validation for disabling the submit button - separated by payment method
  const isCardSubmitDisabled = !cardDetails.cardNumber ||
    !cardDetails.expiry ||
    !cardDetails.cvc ||
    !cardDetails.country;

  const isSalesTeamSubmitDisabled = !email || !phone;

  const isSubmitDisabled = isSubmitting ||
    !selectedPoints ||
    (paymentMethod === "card" ? isCardSubmitDisabled : isSalesTeamSubmitDisabled);

  return (
    <div className="mx-auto px-4 sm:px-0">
      <h1 className="text-2xl font-bold tracking-tight mb-6">{t("title")}</h1>

      {/* Header back button */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          type="button"
          aria-label={t("back")}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">{t("topUpPoints")}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Points Selection */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("selectPointsHelp")}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {pointOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition-all",
                  selectedPoints?.value === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 text-muted-foreground"
                )}
                onClick={() => handlePointSelection(option)}
              >
                <span className="text-xl font-bold">{groupByThreeDigits(option.value)}</span>
                <span className="text-xs text-muted-foreground">{t("points")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Development Mode Toggle - only for card payment method */}
        {paymentMethod === "card" && (
          <div className="flex items-center gap-2">
            <Label htmlFor="developmentMode">{t("developmentMode")}</Label>
            <Switch
              id="developmentMode"
              checked={developmentMode}
              onCheckedChange={setDevelopmentMode}
            />
          </div>
        )}

        {/* Payment Methods and Total */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h2 className="text-lg font-medium">{t("paymentMethods")}</h2>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">{t("total")}</p>
            <p className="text-xl font-bold">
              QAR {groupByThreeDigits(selectedPoints?.price || 0)}
            </p>
          </div>
        </div>

        {/* Development Mode: Direct Purchase Button */}
        {developmentMode ? (
          <ConfirmationDialog
            trigger={
              <Button variant="outline">
                {t("purchaseTopUp")} ⬆️
              </Button>
            }
            title={t("confirmPurchase")}
            description={`${t("confirmPurchaseDescription")} QAR ${groupByThreeDigits(selectedPoints?.price || 0)}?`}
            onConfirm={handlePurchaseTopUp}
            onCancel={() => setShowConfirmDialog(false)}
          />
        ) : (
          <>
            {/* Payment Method Selection */}
            <div className="space-y-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md"
              >
                <div>
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <CreditCard
                      className={cn(
                        "h-5 w-5 transition-colors duration-300",
                        paymentMethod === "card" ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <div
                      className={cn(
                        "mt-2",
                        paymentMethod === "card" ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {t("card")}
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="sales-team" id="sales-team" className="peer sr-only" />
                  <Label
                    htmlFor="sales-team"
                    className="flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <ContactSalesIcon isSelected={paymentMethod === "sales-team"} />
                    <div
                      className={cn(
                        "mt-2",
                        paymentMethod === "sales-team" ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {t("contactSalesTeam")}
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* Payment Fields */}
              {paymentMethod === "card" ? (
                <div className="space-y-4 mt-4">
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          CVV
                        </div>
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
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phoneNumber")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+974 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t("message")}</Label>
                    <Input
                      id="message"
                      placeholder={t("message")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions - Conditional rendering for confirmation dialog */}
            {paymentMethod === "card" ? (
              // For card payment, we use the confirmation dialog
              <ConfirmationDialog
                trigger={
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
                      disabled={isSubmitDisabled}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? t("processing") : t("payNow")}
                    </Button>
                  </div>
                }
                title={t("confirmPurchase")}
                description={`${t("confirmPurchaseDescription")} QAR ${groupByThreeDigits(selectedPoints?.price || 0)}?`}
                onConfirm={handlePurchaseTopUp}
                onCancel={() => setShowConfirmDialog(false)}
              />
            ) : (
              // For sales team contact, we don't use the confirmation dialog
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
                  disabled={isSubmitDisabled}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? t("processing") : t("submit")}
                </Button>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}