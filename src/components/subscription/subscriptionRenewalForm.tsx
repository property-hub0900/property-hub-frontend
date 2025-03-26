"use client";

import { StripeCardForm } from "@/components/stripe/stripeCardForm";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowLeft, BanknoteIcon, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Separator } from "../ui/separator";

interface SubscriptionRenewalFormProps {
    onCancel: () => void;
}

export function SubscriptionRenewalForm({ onCancel }: SubscriptionRenewalFormProps) {
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const t = useTranslations();

    const handleCardPaymentSubmit = async (paymentMethodId: string) => {
        try {
            const response = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentMethodId, amount: 200 }), // Hardcoded $2.00 (200 cents)
            });

            const result = await response.json();
            if (result.success) {
                setPaymentSuccess(true);
                setPaymentError(null);
            } else {
                setPaymentError(result.error || "Payment failed");
                setPaymentSuccess(false);
            }
        } catch (err) {
            setPaymentError("An error occurred during payment");
            setPaymentSuccess(false);
        }
    };

    const handleBankTransfer = () => {
        // Handle bank transfer (not implemented here)
        console.log("Bank transfer selected - manual process required.");
        setPaymentSuccess(true); // Simulate success for demo
    };

    return (
        <div className="w-full">
            <Separator />
            <CardHeader className="px-4 sm:px-6 py-4">
                <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="-ml-8 p-0 h-8 w-8" onClick={onCancel}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-xl font-bold">{t("subscriptionRenewal")}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{t("reviewAndUpdatePayment")}</p>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 space-y-6">
                <div className="space-y-2 -mt-3">
                    <div className="flex items-center justify-between gap-2 rounded border p-4">
                        <div className="flex-3">
                            <h3 className="text-base font-medium">{t("subscriptionPlan")}</h3>
                            <p className="text-sm text-muted-foreground">{t("autoRenewalMessage")}</p>
                        </div>
                        <div className="flex-1.5 text-xl sm:text-2xl font-bold text-primary">
                            <span>20</span>{" "}
                            <span className="text-sm font-normal w-full">/ {t("remainingDays")}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-base font-medium">{t("paymentDetails")}</h3>
                    <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-3 w-[400px]">
                        <Label
                            htmlFor="card"
                            className={cn(
                                "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                paymentMethod === "card" ? "border-primary" : "border-muted"
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
                                paymentMethod === "bank" ? "border-primary" : "border-muted"
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
                            <div className="space-y-2">
                                <Label htmlFor="country">{t("country")}</Label>
                                <Select>
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
                            </div>
                        </div>
                    )}

                    {paymentMethod === "bank" && (
                        <div className="space-y-4 pt-2">
                            <div className="rounded-md bg-blue-50 p-4">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-shrink-0 mb-2 sm:mb-0">
                                        <BanknoteIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                    </div>
                                    <div className="sm:ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">{t("bankTransferInfo")}</h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <p>{t("bankTransferInstructions")}</p>
                                            <p>{t("bankName")}: National Bank</p>
                                            <p>{t("accountName")}: Property Explorer LLC</p>
                                            <p>{t("accountNumber")}: 1234567890</p>
                                            <p className="break-words">IBAN: AE123456789012345678901</p>
                                            <p>{t("reference")}: {t("yourAccountEmail")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {paymentError && <p className="text-sm text-red-600">{paymentError}</p>}
                {paymentSuccess && <p className="text-sm text-green-600">{t("paymentSuccessful")}</p>}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 border-t bg-muted/50 px-4 sm:px-6 py-4">
                <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto order-2 sm:order-1">
                    {t("cancel")}
                </Button>
                <Button
                    onClick={paymentMethod === "card" ? undefined : handleBankTransfer}
                    className="w-full sm:w-auto order-1 sm:order-2"
                    disabled={paymentMethod === "card"}
                >
                    {t("payNow")}
                </Button>
            </CardFooter>
        </div>
    );
}