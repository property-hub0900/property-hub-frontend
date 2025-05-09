"use client"

import { useState, useEffect } from "react"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/utils/utils"
import { companyService } from "@/services/protected/company"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { DataTable } from "@/components/dataTable/data-table"
import type { SortingState } from "@tanstack/react-table"
import { Columns } from "./columns"
import { navigationEvents, NAVIGATION_EVENTS } from "@/lib/navigation-events"
import { TopUpForm } from "./top-up-form"
import { useSearchParams, usePathname, useRouter } from "next/navigation"

export default function TopUpSubscriptionPage() {
  const t = useTranslations("topUpSubscription")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [showTopUpForm, setShowTopUpForm] = useState(searchParams.get("showForm") === "true")
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10))
  const [sorting, setSorting] = useState<SortingState>([])

  // Function to update URL parameters
  const updateUrlParams = (params: { page?: number; showForm?: boolean }) => {
    const newParams = new URLSearchParams(searchParams.toString())

    if (params.page === 1 || params.page === undefined) {
      newParams.delete("page")
    } else {
      newParams.set("page", params.page.toString())
    }

    if (params.showForm) {
      newParams.set("showForm", "true")
    } else {
      newParams.delete("showForm")
    }

    router.replace(`${pathname}?${newParams.toString()}`)
  }

  // Update URL when state changes
  useEffect(() => {
    updateUrlParams({ page: currentPage, showForm: showTopUpForm })
  }, [currentPage, showTopUpForm, pathname])

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
    queryKey: ["topUpHistory", statusFilter],
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
    refetchOnWindowFocus: false,
  })

  const isLoading = isLoadingPlans || isLoadingHistory

  const resetPageState = () => {
    setShowTopUpForm(false)
    setStatusFilter(undefined)
    setSorting([])
    setCurrentPage(1)
    updateUrlParams({ page: 1, showForm: false })
    refetchHistory()
  }

  const handleTopUpComplete = () => {
    setShowTopUpForm(false)
    updateUrlParams({ page: currentPage, showForm: false })
    refetchHistory()
  }

  const handleToggleTopUpForm = () => {
    setShowTopUpForm(true)
    updateUrlParams({ page: currentPage, showForm: true })
  }

  useEffect(() => {
    const unsubscribe = navigationEvents.subscribe(NAVIGATION_EVENTS.RESET_TOP_UP_PAGE, resetPageState)
    return unsubscribe
  }, [])

  // Filter the history data based on status if a filter is selected
  const filteredHistory = statusFilter
    ? topUpHistory.filter((item: any) => item.status === statusFilter)
    : topUpHistory

  // Sort the filtered data based on the sorting state
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0] // Use the first sorting criterion
      const aValue = a[id]
      const bValue = b[id]
      if (aValue < bValue) return desc ? 1 : -1
      if (aValue > bValue) return desc ? -1 : 1
      return 0
    }
    return 0
  })

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-full">
      <Loader isLoading={isLoading} />

      <div style={{ display: showTopUpForm ? "none" : "block" }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <Button onClick={handleToggleTopUpForm} className="self-start sm:self-auto">
            {t("addNew")}
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="flex justify-between items-center px-2 py-1">
            <h2 className="text-xl font-bold p-2">{t("history")}</h2>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable
              columns={Columns() as any}
              data={sortedHistory}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </div>
        </div>
      </div>

      <div style={{ display: showTopUpForm ? "block" : "none" }}>
        <TopUpForm onCancel={() => {
          setShowTopUpForm(false)
          updateUrlParams({ page: currentPage, showForm: false })
        }} onComplete={handleTopUpComplete} plans={topUpPlans} />
      </div>
    </div>
  )
}