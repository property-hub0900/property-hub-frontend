"use client"

import { FOR_RENT, FOR_SALE } from "@/constants"
import { useState } from "react"

type SearchTabsProps = {
  t: any
  onTabChange?: (tab: string) => void
  initialTab?: string
}

export default function SearchTabs({ t, onTabChange, initialTab = FOR_SALE }: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  return (
    <div className="flex">
      <button
        className={`py-3 px-6 font-medium rounded-tl-sm ${activeTab === FOR_RENT ? "text-primary-foreground bg-primary" : "text-muted-foreground bg-muted"
          }`}
        onClick={() => handleTabChange(FOR_RENT)}
      >
        {t("search.rent")}
      </button>
      <button
        className={`py-3 px-6 font-medium rounded-tr-sm ${activeTab === FOR_SALE ? "text-primary-foreground bg-primary" : "text-muted-foreground bg-muted"
          }`}
        onClick={() => handleTabChange(FOR_SALE)}
      >
        {t("search.buy")}
      </button>
    </div>
  )
}

