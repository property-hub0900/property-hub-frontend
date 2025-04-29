"use client";

import { useState, useEffect } from "react";
import { Bell, Filter, Check, Clock, Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { useQuery } from "@tanstack/react-query";
import { formatDateAndTime } from "@/utils/utils";

// Sample notification data with categories
const sampleNotifications = [
  {
    id: 1,
    title: "New Message",
    description: "You have received a new message from John Doe",
    timestamp: "2025-04-29T10:15:00",
    formattedTime: "5 min ago",
    category: "message",
    read: false,
  },
  {
    id: 2,
    title: "System Update",
    description: "A new system update is available for installation",
    timestamp: "2025-04-29T08:30:00",
    formattedTime: "2 hours ago",
    category: "system",
    read: false,
  },
  {
    id: 3,
    title: "Task Completed",
    description: 'Task "Update user interface" has been completed',
    timestamp: "2025-04-28T15:45:00",
    formattedTime: "Yesterday",
    category: "task",
    read: true,
  },
  {
    id: 4,
    title: "Meeting Reminder",
    description: "Your meeting with the design team starts in 30 minutes",
    timestamp: "2025-04-28T10:00:00",
    formattedTime: "Yesterday",
    category: "reminder",
    read: true,
  },
  {
    id: 5,
    title: "Payment Received",
    description: "You have received a payment of $500 from Client XYZ",
    timestamp: "2025-04-26T09:15:00",
    formattedTime: "3 days ago",
    category: "payment",
    read: true,
  },
  {
    id: 6,
    title: "New Comment",
    description: "Sarah left a comment on your recent post",
    timestamp: "2025-04-25T14:20:00",
    formattedTime: "4 days ago",
    category: "message",
    read: true,
  },
  {
    id: 7,
    title: "Security Alert",
    description: "Unusual login detected from a new device",
    timestamp: "2025-04-25T08:10:00",
    formattedTime: "4 days ago",
    category: "system",
    read: false,
  },
  {
    id: 8,
    title: "Project Deadline Approaching",
    description: 'Project "Dashboard Redesign" is due in 2 days',
    timestamp: "2025-04-24T11:30:00",
    formattedTime: "5 days ago",
    category: "reminder",
    read: true,
  },
  {
    id: 9,
    title: "New Feature Available",
    description: "The new analytics dashboard is now available",
    timestamp: "2025-04-23T16:45:00",
    formattedTime: "6 days ago",
    category: "system",
    read: true,
  },
  {
    id: 10,
    title: "Welcome to the Platform",
    description:
      "Thank you for joining our platform. Get started with these tips.",
    timestamp: "2025-04-22T09:00:00",
    formattedTime: "1 week ago",
    category: "system",
    read: true,
  },
];

export default function page() {
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notificationData } = useQuery({
    queryKey: ["notificationAll"],
    queryFn: () => customerService.notification(),
    //refetchInterval: 1000,
    //refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (notificationData) {
      const unreadCount = notificationData.results?.filter(
        (notification) => !notification.notificationRecipients[0].readStatus
      ).length;
      setUnreadCount(unreadCount);
    }
  }, [notificationData]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Pagination
  const totalPages = Math.ceil(
    notificationData?.results.length ?? 0 / itemsPerPage
  );
  const currentNotifications = notificationData?.results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mark notification as read
  const markAsRead = (id) => {
    console.log("markAsRead");
  };

  // Mark all as read
  const markAllAsRead = () => {
    console.log("markAllAsRead");
  };

  // Count unread notifications
  // const unreadCount = notifications.filter(
  //   (notification) => !notification.read
  // ).length;

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="">Notifications</h4>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "All caught up!"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4 px-6">
          <div className="flex items-center">
            <CardTitle className="text-base font-medium">
              All Notifications
            </CardTitle>
          </div>
        </CardHeader>
        <Separator />
        {currentNotifications && currentNotifications?.length > 0 ? (
          <>
            {currentNotifications.map((notification, index) => (
              <div key={notification.notificationId}>
                {/* {index > 0 && <Separator />} */}
                <div
                  key={notification.notificationId}
                  className={`px-4 py-4 hover:bg-muted-foreground/5 cursor-pointer border-b ${
                    !notification.notificationRecipients[0].readStatus
                      ? "bg-primary/10"
                      : ""
                  }`}
                  onClick={() => markAsRead(notification.notificationId)}
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
            <h3 className="text-lg font-medium mb-1">No notifications found</h3>
            <p className="text-sm">Try changing your filters or search terms</p>
          </div>
        )}

        {notificationData && notificationData.results.length > itemsPerPage && (
          <CardContent className="pt-2 pb-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  // Show first page, last page, and pages around current page
                  if (
                    i === 0 ||
                    i === totalPages - 1 ||
                    (i >= currentPage - 2 && i <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    (i === 1 && currentPage > 3) ||
                    (i === totalPages - 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
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
