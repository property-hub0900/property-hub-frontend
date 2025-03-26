"use client";

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
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface StripeCardFormProps {
    onSubmit: (paymentMethodId: string) => Promise<void>;
    amount: number; // Amount in cents
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
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        const cardElement = elements.getElement(CardNumberElement);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement as any,
                billing_details: {
                    name: "Jenny Rosen", // Consider making this dynamic
                },
            });

            if (error) {
                setErrors((prev) => ({ ...prev, cardNumber: error.message }) as any);
                setLoading(false);
                return;
            }

            await onSubmit(paymentMethod.id); // Pass paymentMethodId to parent
        } catch (err) {
            setErrors((prev) => ({ ...prev, cardNumber: "An error occurred" }));
        } finally {
            setLoading(false);
        }
    };

    const allFieldsComplete =
        complete.cardNumber && complete.cardExpiry && complete.cardCvc;

    const cardIcons = [
        { brand: "mastercard", src: "/cards/mastercard.svg", alt: "Mastercard" },
        { brand: "visa", src: "/cards/visa.svg", alt: "Visa" },
        { brand: "amex", src: "/cards/amex.svg", alt: "American Express" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="space-y-4">
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

                <Button
                    type="submit"
                    disabled={!allFieldsComplete || loading}
                    className="w-full mt-4"
                >
                    {loading ? t("processing") : t("payNow")}
                </Button>
            </div>
        </form>
    );
}