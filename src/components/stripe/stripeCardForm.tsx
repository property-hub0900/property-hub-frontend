"use client";

import type React from "react";

import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { companyService } from "@/services/protected/company";
import { firebaseImageLoader } from "@/lib/firebaseUtil";

// Initialize Stripe with your publishable key
// Make sure this is loaded only on the client side
const stripePromise =
  typeof window !== "undefined"
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
    : null;

interface StripeCardFormProps {
  onSubmit: (
    paymentMethodId: string,
    billingDetails: BillingDetails
  ) => Promise<void>;
  amount: number; // Amount in cents
}

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

// The wrapper component that provides Stripe context
export function StripeCardForm({ onSubmit, amount }: StripeCardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CardForm onSubmit={onSubmit} amount={amount} />
    </Elements>
  );
}

// The actual form component
function CardForm({ onSubmit, amount }: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState<string>("");
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    country: "",
    general: "",
  });
  const [complete, setComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const t = useTranslations();

  const elementStyle = {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      "::placeholder": {
        color: "#aab7c4",
      },
      padding: "10px 0",
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  };

  const handleChange = (
    event: any,
    elementType: "cardNumber" | "cardExpiry" | "cardCvc"
  ) => {
    setErrors((prev) => ({
      ...prev,
      [elementType]: event.error ? event.error.message : "",
      general: "", // Clear general errors when user makes changes
    }));

    setComplete((prev) => ({
      ...prev,
      [elementType]: event.complete,
    }));

    // Update card brand when the card number changes
    if (elementType === "cardNumber" && event.brand) {
      setCardBrand(event.brand !== "unknown" ? event.brand : null);
    }
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setErrors((prev) => ({ ...prev, country: "" }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate country
    if (!country) {
      setErrors((prev) => ({ ...prev, country: t("countryRequired") }));
      return;
    }

    // Validate stripe and elements are loaded
    if (!stripe || !elements) {
      setErrors((prev) => ({
        ...prev,
        general: "Payment processing is not ready. Please try again.",
      }));
      return;
    }

    setLoading(true);
    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      setErrors((prev) => ({
        ...prev,
        general: "Card information is missing. Please refresh and try again.",
      }));
      setLoading(false);
      return;
    }

    const currentUserData: any = await companyService.getMe();

    try {
      // Prepare billing details from user data
      const billingDetails: BillingDetails = {
        name: currentUserData.firstName + " " + currentUserData.lastName,
        email: currentUserData.user.email,
        phone: currentUserData.phoneNumber,
      };

      // Create payment method with billing details
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone,
        },
      });

      if (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message || "Payment failed. Please try again.",
        }));
        setLoading(false);
        return;
      }

      if (!paymentMethod || !paymentMethod.id) {
        throw new Error("Failed to create payment method");
      }

      await onSubmit(paymentMethod.id, billingDetails);
    } catch (err) {
      console.error("Payment error:", err);
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred. Please try again later.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const allFieldsComplete =
    complete.cardNumber && complete.cardExpiry && complete.cardCvc && !!country;

  const cardIcons = [
    { brand: "mastercard", src: "/cards/mastercard.svg", alt: "Mastercard" },
    { brand: "visa", src: "/cards/visa.svg", alt: "Visa" },
    { brand: "amex", src: "/cards/amex.svg", alt: "American Express" },
    { brand: "discover", src: "/cards/discover.svg", alt: "Discover" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-4">
        {/* Display general errors at the top */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="cardNumber">{t("cardNumber")}</Label>
          <div className="mt-1 p-3 border border-gray-300 rounded-md bg-white w-full relative">
            <div className="flex items-center">
              <div className="flex-grow">
                <CardNumberElement
                  id="cardNumber"
                  options={{
                    style: elementStyle,
                    showIcon: false,
                  }}
                  onChange={(e) => handleChange(e, "cardNumber")}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {cardIcons.map((icon) => (
                    <Image
                      key={icon.brand}
                      src={icon.src || "/placeholder.svg"}
                      alt={icon.alt}
                      width={32}
                      height={20}
                      className={`h-5 w-auto transition-opacity ${cardBrand && cardBrand !== icon.brand
                        ? "opacity-30"
                        : "opacity-100"
                        }`}
                      loader={firebaseImageLoader}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {errors.cardNumber && (
            <p className="text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cardExpiry">{t("expiration")}</Label>
            <div className="mt-1 p-3 border border-gray-300 rounded-md bg-white w-full">
              <CardExpiryElement
                id="cardExpiry"
                options={{ style: elementStyle }}
                onChange={(e) => handleChange(e, "cardExpiry")}
              />
            </div>
            {errors.cardExpiry && (
              <p className="text-sm text-red-600">{errors.cardExpiry}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardCvc">{t("cvc")}</Label>
            <div className="mt-1 p-3 border border-gray-300 rounded-md bg-white w-full relative">
              <CardCvcElement
                id="cardCvc"
                options={{ style: elementStyle }}
                onChange={(e) => handleChange(e, "cardCvc")}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {cardBrand === "amex" ? (
                  <span className="text-xs text-muted-foreground">
                    4 digits
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    3 digits
                  </span>
                )}
              </div>
            </div>
            {errors.cardCvc && (
              <p className="text-sm text-red-600">{errors.cardCvc}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">{t("country")}</Label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder={t("select")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">{t("countries.us")}</SelectItem>
              <SelectItem value="ca">{t("countries.ca")}</SelectItem>
              <SelectItem value="uk">{t("countries.uk")}</SelectItem>
              <SelectItem value="au">{t("countries.au")}</SelectItem>
              <SelectItem value="ae">{t("countries.ae")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-600">{errors.country}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!stripe || !elements || !allFieldsComplete || loading}
          className="w-full mt-4"
        >
          {loading
            ? t("processing")
            : `${t("payNow")} ${(amount / 100).toFixed(2)}`}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-2">
          {t("securePaymentNotice")}
        </p>
      </div>
    </form>
  );
}
