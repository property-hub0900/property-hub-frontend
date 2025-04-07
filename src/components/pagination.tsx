"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: PaginationProps) {
  const t = useTranslations();

  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible pages
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      // Calculate start and end of visible pages
      let start = Math.max(currentPage - 1, 1);
      let end = Math.min(currentPage + 1, totalPages - 2);

      // Adjust if we're near the start or end
      if (currentPage <= 2) {
        end = 3;
      }
      if (currentPage >= totalPages - 3) {
        start = totalPages - 4;
      }

      // Add ellipsis if needed
      if (start > 1) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          {t("button.previous")}
        </Button>

        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            variant={currentPage === page ? "outline" : "ghost"}
            size="icon"
            onClick={() =>
              typeof page === "number" ? handlePageChange(page) : undefined
            }
            disabled={typeof page !== "number"}
          >
            {page === "..." ? "..." : (page as number) + 1}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="border-muted-foreground/40 text-foreground"
        >
          {t("button.next")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground hidden">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
    </div>
  );
}
