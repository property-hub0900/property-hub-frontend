"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, Check } from "lucide-react";
import { JSX, useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { customerService } from "@/services/protected/customer";
import { formatDateAndTime, getErrorMessage } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "@/components/loader";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function page() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const { data: notificationData, isLoading: isLoadingNotifications } =
    useQuery({
      queryKey: ["notifications", "notificationsAll"],
      queryFn: () => customerService.notification(),
    });

  const notificationMarkAllAsReadMutation = useMutation({
    mutationFn: customerService.notificationMarkAllAsRead,
  });

  const notificationMarkAsReadMutation = useMutation({
    mutationFn: customerService.notificationMarkAsRead,
  });

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      await notificationMarkAsReadMutation.mutateAsync(notificationId);
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await notificationMarkAllAsReadMutation.mutateAsync();
      toast.success(response.message);
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Calculate unread count whenever notification data changes
  useEffect(() => {
    if (notificationData) {
      const count =
        notificationData.results?.filter(
          (notification) => !notification.notificationRecipients[0].readStatus
        ).length || 0;

      setUnreadCount(count);
    }
  }, [notificationData]);

  // Calculate pagination details
  const totalItems = notificationData?.results?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure current page is valid
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Get current page items
  const getCurrentPageItems = () => {
    if (!notificationData?.results) return [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return notificationData.results.slice(startIndex, endIndex);
  };

  const currentNotifications = getCurrentPageItems();

  // Paginate to a specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Create pagination items
  const renderPaginationItems = (): JSX.Element[] => {
    const items: JSX.Element[] = [];

    // First page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goToPage(1);
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Ellipsis after first page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Pages around current
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages as they're handled separately

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(i);
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis before last page
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Last page (if not the first page)
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isLoadingNotifications || notificationMarkAllAsReadMutation.isPending) {
    return <Loader isLoading={true}></Loader>;
  }
  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-xl font-bold">{t("title.notifications")}</h4>
          {/* <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "All caught up!"}
          </p> */}
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="flex items-center gap-1"
            >
              <Check className="h-4 w-4" />
              {t("button.markAllAsRead")}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="py-4 px-6">
          <div className="flex items-center">
            <CardTitle className="text-base font-medium">
              {t("title.allNotifications")}
            </CardTitle>
          </div>
        </CardHeader>
        <Separator />

        {currentNotifications && currentNotifications.length > 0 ? (
          <>
            {currentNotifications.map((notification) => (
              <div key={notification.notificationId}>
                <div
                  className={`px-4 py-4 hover:bg-muted-foreground/5 cursor-pointer border-b ${
                    !notification.notificationRecipients[0].readStatus
                      ? "bg-primary/10"
                      : ""
                  }`}
                  onClick={() =>
                    !notification.notificationRecipients[0]?.readStatus &&
                    markAsRead(notification.notificationId)
                  }
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`flex-1 ${
                        !notification.notificationRecipients[0].readStatus
                          ? "font-medium"
                          : ""
                      }`}
                    >
                      <p className="font-semibold text-sm">
                        {notification.titleEn}
                      </p>
                      <p className="text-sm text-gray-600">
                        {notification.bodyEn}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateAndTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.notificationRecipients[0].readStatus && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-1">
              {t("text.noNotifications")}
            </p>
          </div>
        )}

        {totalItems > itemsPerPage && (
          <CardContent className="pt-2 pb-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
