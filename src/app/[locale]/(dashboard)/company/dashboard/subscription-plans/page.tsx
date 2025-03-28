"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, ArrowRight, Filter } from "lucide-react"
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
                    <Card className="w-full">
                        <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl">{t("subscriptionPlan")}</CardTitle>
                                    <CardDescription>{t("pointsAddedToAccount")}</CardDescription>
                                </div>
                                <Button onClick={() => setShowRenewalForm(true)} className="flex items-center gap-2 w-full sm:w-auto">
                                    {t("renewSubscription")} <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="text-3xl sm:text-4xl font-bold text-primary">
                                        1500 <span className="text-sm font-normal text-muted-foreground">/ {t("remainingPoints")}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 flex-shrink-0" /> {t("pointsExpires")}
                                    </div>
                                    <div className="font-medium">{t("onDate", { date: "April 15, 2025" })}</div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 flex-shrink-0" /> {t("contractExpires")}
                                    </div>
                                    <div className="font-medium">{t("onDate", { date: "April 15, 2025" })}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-white rounded-md shadow">
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

