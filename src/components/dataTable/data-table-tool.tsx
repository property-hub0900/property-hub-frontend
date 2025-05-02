import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
    table,
    searchValue,
    onSearchChange,
    searchPlaceholder,
}: DataTableToolbarProps<TData>) {
    const t = useTranslations();
    const [localSearch, setLocalSearch] = useState(searchValue);

    // Debounce search input (500ms delay)
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchChange(localSearch);
        }, 500);
        return () => clearTimeout(handler);
    }, [localSearch, onSearchChange]);

    // Sync local search with prop changes
    useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    return (
        <div className="flex items-center py-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t("search")} // "بحث"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="pl-10 pr-10"

                // aria-label={t("form.keywordSearch.label")} // "البحث"
                />
                {localSearch && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={() => setLocalSearch("")}
                    // aria-label={t("button.reset")} // "إعادة تعيين"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                )}
            </div>
        </div>
    );
}