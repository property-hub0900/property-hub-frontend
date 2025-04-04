"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Filter, Menu } from "lucide-react"
import { useTranslations } from "next-intl"
import { TransactionHistory } from "@/components/subscription/transactionHistory"
import { SubscriptionRenewalForm } from "@/components/subscription/subscriptionRenewalForm"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function SubscriptionPlansPage() {
    const [showRenewalForm, setShowRenewalForm] = useState(false)
    const t = useTranslations()

    return (
        <div className="space-y-6 w-full max-w-full px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10 bg-background pb-4 border-b">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{t("subscription")}</h1>

                {/* Mobile menu - only visible on small screens */}
                <div className="sm:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <div className="flex flex-col gap-4 mt-8">
                                <Button onClick={() => setShowRenewalForm(true)} className="w-full justify-start">
                                    {t("renewSubscription")}
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Filter className="h-4 w-4 mr-2" /> {t("filters")}
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {showRenewalForm ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <SubscriptionRenewalForm onCancel={() => setShowRenewalForm(false)} />
                </div>
            ) : (
                <div className="animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Left Panel - Subscription Plan */}
                        <div className="lg:col-span-2 border rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold">{t("subscriptionPlan")}</h2>
                                    <p className="text-sm text-muted-foreground mt-1">{t("pointsAddedToAccount")}</p>
                                </div>

                                {/* Desktop renewal button - hidden on mobile */}
                                <Button
                                    onClick={() => setShowRenewalForm(true)}
                                    variant="outline"
                                    className="hidden sm:flex items-center gap-2 border-gray-300 mt-4 sm:mt-0"
                                >
                                    {t("renewSubscription")} <ArrowRight className="h-4 w-4 text-primary" />
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 sm:mt-8">
                                <div className="text-4xl sm:text-5xl font-bold text-primary">
                                    1500 <span className="text-xs sm:text-sm font-normal text-primary">/ {t("remainingPoints")}</span>
                                </div>

                                {/* Mobile renewal button - only visible on mobile */}
                                <Button
                                    onClick={() => setShowRenewalForm(true)}
                                    variant="outline"
                                    className="sm:hidden flex items-center gap-2 border-gray-300 mt-4 w-full justify-center"
                                >
                                    {t("renewSubscription")} <ArrowRight className="h-4 w-4 text-primary" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Panel - Expiration Dates */}
                        <div className="lg:col-span-1 border rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold">{t("pointsExpires")}</h2>
                                    <p className="text-sm text-muted-foreground mt-1">{t("onDate", { date: "April 13, 2025" })}</p>
                                </div>

                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold">{t("contractExpires")}</h2>
                                    <p className="text-sm text-muted-foreground mt-1">{t("onDate", { date: "April 13, 2025" })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-md border shadow-sm mt-6 sm:mt-8">
                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold">{t("subscriptionRecordsHistory")}</h2>

                                {/* Desktop filter button - hidden on mobile */}
                                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                                    <Filter className="h-4 w-4" /> {t("filters")}
                                </Button>
                            </div>

                            <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-md">
                                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                    <TransactionHistory />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

