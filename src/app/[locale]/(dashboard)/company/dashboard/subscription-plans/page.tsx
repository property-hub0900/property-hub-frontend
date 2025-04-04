"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { TransactionHistory } from "@/components/subscription/transactionHistory"
import { SubscriptionRenewalForm } from "@/components/subscription/subscriptionRenewalForm"

export default function SubscriptionPlansPage() {
    const [showRenewalForm, setShowRenewalForm] = useState(false)
    const t = useTranslations()

    return (
        <div className="space-y-6 w-full max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-bold">{t("subscription")}</h1>
            </div>

            {showRenewalForm ? (
                <SubscriptionRenewalForm onCancel={() => setShowRenewalForm(false)} />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Left Panel - Subscription Plan */}
                        <div className="md:col-span-2 border rounded-lg p-6">
                            <h2 className="text-xl font-semibold">{t("subscriptionPlan")}</h2>
                            <p className="text-muted-foreground mt-1">{t("pointsAddedToAccount")}</p>

                            <div className="flex justify-between items-center mt-8">
                                <div className="text-5xl font-bold text-primary">
                                    1500 <span className="text-sm font-normal text-primary">/ {t("remainingPoints")}</span>
                                </div>
                                <Button onClick={() => setShowRenewalForm(true)} variant="outline" className="flex items-center gap-2 border-gray-300">
                                    {t("renewSubscription")} <ArrowRight className="h-4 w-4 text-primary" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Panel - Expiration Dates */}
                        <div className="md:col-span-1 border rounded-lg p-6 space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold">{t("pointsExpires")}</h2>
                                <p className="text-muted-foreground mt-1">{t("onDate", { date: "April 13, 2025" })}</p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">{t("contractExpires")}</h2>
                                <p className="text-muted-foreground mt-1">{t("onDate", { date: "April 13, 2025" })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-md shadow">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                <h2 className="text-base sm:text-lg font-semibold">{t("subscriptionRecordsHistory")}</h2>
                                <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                                    <Filter className="h-4 w-4" /> {t("filters")}
                                </Button>
                            </div>

                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                    <TransactionHistory />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

