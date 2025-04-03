/* eslint-disable no-unused-vars */
"use client";

import { PROPERTY_PURPOSE } from "@/constants/constants";
import { useTranslations } from "next-intl";
import { useState } from "react";

type SearchTabsProps = {
  onTabChange?: (tab: string) => void;
  initialTab?: string;
};

export default function SearchTabs({
  onTabChange,
  initialTab = PROPERTY_PURPOSE[0],
}: SearchTabsProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="flex">
      <button
        className={`py-3 px-6 font-medium rounded-tl-sm ${
          activeTab === PROPERTY_PURPOSE[1]
            ? "text-primary-foreground bg-primary"
            : "text-foreground bg-muted"
        }`}
        onClick={() => handleTabChange(PROPERTY_PURPOSE[1])}
      >
        {t(`button.rent`)}
      </button>
      <button
        className={`py-3 px-6 font-medium rounded-tr-sm ${
          activeTab === PROPERTY_PURPOSE[0]
            ? "text-primary-foreground bg-primary"
            : "text-foreground bg-muted"
        }`}
        onClick={() => handleTabChange(PROPERTY_PURPOSE[0])}
      >
        {t(`button.buy`)}
      </button>
    </div>
  );
}
