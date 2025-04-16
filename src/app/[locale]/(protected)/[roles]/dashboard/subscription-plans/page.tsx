"use client"

import { Loader } from "@/components/loader"
import { SubscriptionRenewalForm } from "@/components/subscription/subscriptionRenewalForm"
import { TransactionHistory } from "@/components/subscription/transactionHistory"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { companyService } from "@/services/protected/company"
import { useAuthStore } from "@/store/auth-store"
import { formatDate } from "@/utils/utils"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, Filter, Loader2, Menu } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function SubscriptionPlansPage() {
    const t = useTranslations()
    const { user } = useAuthStore()

    const [showRenewalForm, setShowRenewalForm] = useState(false)
    const [filters, setFilters] = useState("all")
    const [filteredSubscriptions, setFilteredSubscriptions] = useState<Transaction[]>([]);

    let { data: subscription, isLoading: isLoadingSubscription }: any = useQuery({
        queryKey: ["subscription"],
        queryFn: () => companyService.getCompanySubscription(),
    } as any)

    useEffect(() => {
        if (!subscription || !subscription.results) {
            setFilteredSubscriptions([]);
            return;
        }

        const today = new Date();
        let filtered: Transaction[] = subscription.results;

        if (filters === "active") {
            filtered = subscription.results.filter((s) => {
                const isActive = s.endDate && new Date(s.endDate) > today;
                console.log(`Subscription ${s.subscriptionId}: endDate=${s.endDate}, isActive=${isActive}`);
                return isActive;
            });
            filtered['results'] = filtered;
        } else if (filters === "inactive") {
            filtered = subscription.results.filter((s) => {
                const isInactive = s.endDate && new Date(s.endDate) <= today;
                console.log(`Subscription ${s.subscriptionId}: endDate=${s.endDate}, isInactive=${isInactive}`);
                return isInactive;
            });
            filtered['results'] = filtered;
        }
        else {
            filtered = subscription;
        }

        setFilteredSubscriptions(filtered);
    }, [subscription, filters]);
    return (
        <>
            <Loader isLoading={isLoadingSubscription} />
            <div className="space-y-6 w-full max-w-full px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10 bg-background pb-4 border-b">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{t("subscription")}</h1>
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
                        <SubscriptionRenewalForm
                            onCancel={() => setShowRenewalForm(false)}
                            subscription={subscription}
                            user={user}
                        />
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
                                        {user?.company?.sharedPoints} <span className="text-xs sm:text-sm font-normal text-primary">/ {t("remainingPoints")}</span>
                                    </div>


                                    <Button
                                        onClick={() => setShowRenewalForm(true)}
                                        variant="outline"
                                        className="sm:hidden flex items-center gap-2 border-gray-300 mt-4 w-full justify-center"
                                    >
                                        {t("renewSubscription")} <ArrowRight className="h-4 w-4 text-primary" />
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:col-span-1 border rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold">{t("pointsExpires")}</h2>
                                        <p className="text-sm text-muted-foreground mt-1">{t("onDate", { date: formatDate(user?.company?.subscriptionEndDate) })}</p>
                                    </div>

                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold">{t("contractExpires")}</h2>
                                        <p className="text-sm text-muted-foreground mt-1">{t("onDate", { date: formatDate(user?.company?.CompanyContract?.contractExpiryDate) })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md border shadow-sm mt-6 sm:mt-8">
                            <div className="p-4 sm:p-6 md:p-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                                    <h2 className="text-base sm:text-lg md:text-xl font-semibold">{t("subscriptionRecordsHistory")}</h2>

                                    <div>
                                        <Select onValueChange={(value) => setFilters(value)}>
                                            <SelectTrigger>
                                                <Filter className="h-4 w-4" /> {t("filters")}
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-md">
                                    <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                        <TransactionHistory subscription={filteredSubscriptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

