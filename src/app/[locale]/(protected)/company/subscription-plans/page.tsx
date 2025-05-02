"use client";

import { Loader } from "@/components/loader";
import { SubscriptionRenewalForm } from "@/components/subscription/subscriptionRenewalForm";
import { TransactionHistory } from "@/components/subscription/transactionHistory";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { companyService } from "@/services/protected/company";
import { useAuthStore } from "@/store/auth-store";
import { formatDate, groupByThreeDigits } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Filter, Loader2, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { navigationEvents, NAVIGATION_EVENTS } from "@/lib/navigation-events";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

// Define Transaction interface
interface Transaction {
    subscriptionId: number;
    createdAt: string;
    points: number;
    paymentMethod: string;
    type: string;
    endDate?: string; // Optional to handle cases where it might be missing
    status?: string; // e.g., "pending", "approved"
}

// Define Subscription data structure from API
interface Subscription {
    results: Transaction[];
    total?: number;
}

type ViewType = "default" | "renewal";
type FilterType = "all" | "active" | "pending" | "expired" | "needApproval";

export default function SubscriptionPlansPage() {
    const t = useTranslations();
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State management
    const [view, setView] = useState<ViewType>(searchParams.get("view") === "renewal" ? "renewal" : "default");
    const [filter, setFilter] = useState<FilterType>("all");

    // Fetch subscription data
    const { data: subscription, isLoading: isLoadingSubscription, refetch }: any = useQuery<any>({
        queryKey: ["subscription"],
        queryFn: () => companyService.getCompanySubscription(),
    });

    // Handle view changes and update URL
    const handleViewChange = (newView: ViewType) => {
        setView(newView);
        const params = new URLSearchParams(searchParams);
        if (newView === "default") {
            params.delete("view");
        } else {
            params.set("view", newView);
        }
        router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    };

    // Reset page state on navigation event
    useEffect(() => {
        const unsubscribe = navigationEvents.subscribe(NAVIGATION_EVENTS.RESET_SUBSCRIPTION_PAGE, () => {
            handleViewChange("default");
        });
        return unsubscribe;
    }, []);

    // Compute filtered subscriptions
    const filteredSubscriptions = useMemo(() => {
        if (!subscription?.results) return [];

        const today = new Date();
        let filtered: Transaction[] = subscription.results;

        if (filter === "active") {
            filtered = subscription.results.filter((s) => {
                if (!s.endDate) return false;
                if (s.status === "pending") return false;
                const endDate = new Date(s.endDate);
                if (isNaN(endDate.getTime())) {
                    console.warn(`Invalid endDate for subscription ${s.subscriptionId}: ${s.endDate}`);
                    return false;
                }
                return endDate > today;
            });
        } else if (filter === "pending") {
            filtered = subscription.results.filter((s) => {
                if (!s.status) return false;
                return s.status === "pending";
            });
        } else if (filter === "expired") {
            filtered = subscription.results.filter((s) => {
                if (!s.endDate) return false;
                const endDate = new Date(s.endDate);
                return endDate <= today;
            });
        }
        console.log(`Filtered subscriptions (${filter}):`, filtered);
        return filtered;
    }, [subscription, filter]);

    return (
        <>
            <Loader isLoading={isLoadingSubscription} />
            <div className="space-y-6 w-full max-w-full px-4 sm:px-6 py-4 sm:py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{t("subscription")}</h1>

                </div>

                {view === "renewal" ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <SubscriptionRenewalForm
                            onCancel={() => handleViewChange("default")}
                            subscription={subscription}
                            user={user}
                        />
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        {/* Subscription Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                            <div className="lg:col-span-2 border rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold">{t("subscriptionPlan")}</h2>
                                        <p className="text-sm text-muted-foreground mt-1">{t("pointsAddedToAccount")}</p>
                                    </div>
                                    <Button
                                        onClick={() => handleViewChange("renewal")}
                                        variant="outline"
                                        className="hidden sm:flex items-center gap-2 border-gray-300 mt-4 sm:mt-0"
                                    >
                                        {t("renewSubscription")} <ArrowRight className="h-4 w-4 text-primary" />
                                    </Button>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 sm:mt-8">
                                    <div className="text-4xl sm:text-5xl font-bold text-primary">
                                        {groupByThreeDigits(user?.company?.sharedPoints ?? 0)}{" "}
                                        <span className="text-xs sm:text-sm font-normal text-primary">/ {t("remainingPoints")}</span>
                                    </div>
                                    <Button
                                        onClick={() => handleViewChange("renewal")}
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
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {user?.company?.subscriptionEndDate
                                                ? t("onDate", { date: formatDate(user.company.subscriptionEndDate) })
                                                : t("notAvailable")}
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold">{t("contractExpires")}</h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {user?.company?.CompanyContract?.contractExpiryDate
                                                ? t("onDate", { date: formatDate(user.company.CompanyContract.contractExpiryDate) })
                                                : t("notAvailable")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="rounded-md border shadow-sm mt-6 sm:mt-8">
                            <div className="p-4 sm:p-6 md:p-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                                    <h2 className="text-base sm:text-lg md:text-xl font-semibold">{t("subscriptionRecordsHistory")}</h2>
                                    <div className="flex flex-row justify-between items-center gap-4">
                                        <Select onValueChange={(value) => setFilter(value as FilterType)} value={filter}>
                                            <SelectTrigger>
                                                {t(`form.status.options.${filter}`)}
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t("form.status.options.all")}</SelectItem>
                                                <SelectItem value="active">{t("form.status.options.active")}</SelectItem>
                                                <SelectItem value="pending">{t("form.status.options.needApproval")}</SelectItem>
                                                <SelectItem value="expired">{t("form.status.options.expired")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-md">
                                    <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                        {filteredSubscriptions.length === 0 && !isLoadingSubscription ? (
                                            <p className="text-center text-muted-foreground py-4">{t("noTransactions")}</p>
                                        ) : (<>

                                            <TransactionHistory subscription={filteredSubscriptions} />
                                        </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}