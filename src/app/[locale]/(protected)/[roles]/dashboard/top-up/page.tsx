"use client"

import { DataTable } from "@/components/dataTable/data-table"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getErrorMessage } from "@/utils/utils"
import { companyService } from "@/services/protected/company"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Columns } from "./columns"
import { TopUpForm } from "./top-up-form"
import { navigationEvents, NAVIGATION_EVENTS } from "@/lib/navigation-events"

export default function TopUpSubscriptionPage() {
  const t = useTranslations("topUpSubscription")
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [showTopUpForm, setShowTopUpForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch top-up plans
  const { data: topUpPlans = [], isLoading: isLoadingPlans } = useQuery({
    queryKey: ["topUpPlans"],
    queryFn: async () => {
      try {
        const response: any = await companyService.getTopUpPlans()
        return response.results || []
      } catch (error) {
        console.error("Failed to fetch top-up plans:", error)
        toast.error(getErrorMessage(error))
        return []
      }
    },
  })

  // Fetch top-up history using React Query
  const {
    data: topUpHistory = [],
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["topUpHistory", statusFilter], // Include statusFilter in the query key
    queryFn: async () => {
      try {
        const response: any = await companyService.getTopUpHistoryAndPointsTransactions("topup", 0, 999)
        return response.results || []
      } catch (error) {
        console.error("Failed to fetch top-up history:", error)
        toast.error(getErrorMessage(error))
        return []
      }
    },
    // Enable refetching when component mounts or when dependencies change
    refetchOnWindowFocus: false,
  })

  const isLoading = isLoadingPlans || isLoadingHistory

  const resetPageState = () => {
    setShowTopUpForm(false)
    setStatusFilter(undefined)
    // Refetch history data when resetting the page
    refetchHistory()
  }

  // Handle form completion
  const handleTopUpComplete = () => {
    setShowTopUpForm(false)
    // Refetch history data when a top-up is completed
    refetchHistory()
  }

  useEffect(() => {
    const unsubscribe = navigationEvents.subscribe(NAVIGATION_EVENTS.RESET_TOP_UP_PAGE, resetPageState)
    return unsubscribe
  }, [])

  // Filter the history data based on status if a filter is selected
  const filteredHistory = statusFilter ? topUpHistory.filter((item: any) => item.status === statusFilter) : topUpHistory

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-full">
      <Loader isLoading={isLoading} />

      <div style={{ display: showTopUpForm ? "none" : "block" }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <Button onClick={() => setShowTopUpForm(true)} className="self-start sm:self-auto">
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
                  <SelectItem value={undefined as any}>{t("allStatuses")}</SelectItem>
                  <SelectItem value="paid">{t("statusPaid")}</SelectItem>
                  <SelectItem value="pending">{t("statusPending")}</SelectItem>
                  <SelectItem value="cancelled">{t("statusCancelled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable columns={Columns() as any} data={filteredHistory} />
          </div>
        </div>
      </div>

      <div style={{ display: showTopUpForm ? "block" : "none" }}>
        <TopUpForm onCancel={() => setShowTopUpForm(false)} onComplete={handleTopUpComplete} plans={topUpPlans} />
      </div>
    </div>
  )
}
