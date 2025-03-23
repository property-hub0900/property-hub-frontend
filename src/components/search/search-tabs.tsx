"use client"

import { useState } from "react"

type SearchTabsProps = {
  t: any
  onTabChange?: (tab: string) => void
}

export default function SearchTabs({ t, onTabChange }: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState<"rent" | "buy">("buy")

  const handleTabChange = (tab: "rent" | "buy") => {
    setActiveTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  return (
    <div className="flex">
      <button
        className={`py-3 px-6 font-medium rounded-tl-sm ${activeTab === "rent" ? "text-primary-foreground bg-primary" : "text-muted-foreground bg-muted"
          }`}
        onClick={() => handleTabChange("rent")}
      >
        {t("search.rent")}
      </button>
      <button
        className={`py-3 px-6 font-medium rounded-tr-sm ${activeTab === "buy" ? "text-primary-foreground bg-primary" : "text-muted-foreground bg-muted"
          }`}
        onClick={() => handleTabChange("buy")}
      >
        {t("search.buy")}
      </button>
    </div>
  )
}

