"use client";

import { DataTable } from "@/components/dataTable/data-table";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/utils/utils";
import { companyService } from "@/services/protected/company";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Columns } from "./columns";
import { TopUpForm } from "./top-up-form";

// Sample data for development/fallback
const topUpData = [
  {
    id: "1",
    date: new Date("2025-03-10"),
    points: 10,
    expires: "10 Days",
    paymentMethod: "Credit/Debit",
    subscriptionExpiryDate: new Date("2025-04-10"),
    status: "Paid",
  },
  {
    id: "2",
    date: new Date("2025-03-10"),
    points: 30,
    expires: "7 Days",
    paymentMethod: "Sales Team",
    subscriptionExpiryDate: new Date("2025-04-12"),
    status: "Cancelled",
  },
  {
    id: "3",
    date: new Date("2025-03-10"),
    points: 25,
    expires: "2 Days",
    paymentMethod: "Credit/Debit",
    subscriptionExpiryDate: new Date("2025-04-14"),
    status: "Paid",
  },
  {
    id: "4",
    date: new Date("2025-03-20"),
    points: 50,
    expires: "14 Days",
    paymentMethod: "PayPal",
    subscriptionExpiryDate: new Date("2025-04-20"),
    status: "Pending",
  },
  {
    id: "5",
    date: new Date("2025-03-22"),
    points: 15,
    expires: "5 Days",
    paymentMethod: "Credit/Debit",
    subscriptionExpiryDate: new Date("2025-04-22"),
    status: "Paid",
  },
];

export default function TopUpSubscriptionPage() {
  const t = useTranslations("topUpSubscription");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const [topUpHistory, setTopUpHistory] = useState(topUpData);
  const [topUpPlans, setTopUpPlans] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch top-up history (this would be a real API call in production)
  const { isLoading: isLoadingHistory } = useQuery({
    queryKey: ["topUpHistory"],
    queryFn: async () => {
      try {
        // In a real app, you would fetch the history from an API
        // For now, we'll use the sample data
        setTopUpHistory(topUpData);
        return topUpData;
      } catch (error) {
        console.error("Failed to fetch top-up history:", error);
        toast.error(getErrorMessage(error));
        return topUpData;
      }
    },
  });

  // Fetch top-up plans
  const { isLoading: isLoadingPlans } = useQuery({
    queryKey: ["topUpPlans"],
    queryFn: async () => {
      try {
        const response: any = await companyService.getTopUpPlans();
        if (response.results) {
          setTopUpPlans(response.results);
        }
        return response.results;
      } catch (error) {
        console.error("Failed to fetch top-up plans:", error);
        toast.error(getErrorMessage(error));
        return [];
      }
    },
  });

  // Filter data based on status
  const filteredData = statusFilter
    ? topUpHistory.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      )
    : topUpHistory;

  const isLoading = isLoadingHistory || isLoadingPlans;

  return (
    <div className="container px-4 sm:px-6 py-6 space-y-6 max-w-full">
      <Loader isLoading={isLoading} />

      <div style={{ display: showTopUpForm ? "none" : "block" }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <Button
            onClick={() => setShowTopUpForm(true)}
            className="self-start sm:self-auto"
          >
            {t("addNew")}
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="flex justify-between items-center px-2 py-1 border-b">
            <h2 className="text-xl font-bold">{t("history")}</h2>
            <div className="flex justify-end p-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined as any}>
                    {t("allStatuses")}
                  </SelectItem>
                  <SelectItem value="paid">{t("statusPaid")}</SelectItem>
                  <SelectItem value="pending">{t("statusPending")}</SelectItem>
                  <SelectItem value="cancelled">
                    {t("statusCancelled")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full overflow-x-auto ">
            <DataTable
              columns={Columns() as any}
              data={filteredData}
              rowClassName={(row) => {
                if (row.status.toLowerCase() === "cancelled")
                  return "bg-red-50/10";
                if (row.status.toLowerCase() === "pending")
                  return "bg-yellow-50/10";
                return "";
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: showTopUpForm ? "block" : "none" }}>
        <TopUpForm
          onCancel={() => setShowTopUpForm(false)}
          plans={topUpPlans}
        />
      </div>
    </div>
  );
}
