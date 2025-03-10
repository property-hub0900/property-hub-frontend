type SearchTabsProps = {
  t: any
}

export default function SearchTabs({ t }: SearchTabsProps) {
  return (
    <div className="flex">
      <button className="py-3 px-6 text-muted-foreground bg-muted font-medium rounded-tl-sm">{t("search.rent")}</button>
      <button className="py-3 px-6 text-primary-foreground bg-primary font-medium rounded-tr-sm">
        {t("search.buy")}
      </button>
    </div>
  )
}

