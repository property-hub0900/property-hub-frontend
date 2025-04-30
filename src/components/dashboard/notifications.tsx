import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/protected/customer";
import { formatDateAndTime, getErrorMessage } from "@/utils/utils";
import Link from "next/link";
import { CUSTOMER_PATHS } from "@/constants/paths";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function NotificationDropdown() {
  const t = useTranslations();

  const queryClient = useQueryClient();

  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { data: notificationData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => customerService.notification(10),
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

  console.log("unreadCount", unreadCount);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-2">
          <h6 className="text-base">{t("title.notifications")}</h6>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-sm text-primary hover:text-primary"
            >
              {t("button.markAllAsRead")}
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-96">
          {notificationData && notificationData.results?.length > 0 ? (
            <div className="">
              {notificationData.results?.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`px-4 py-2 hover:bg-muted-foreground/5 cursor-pointer border-b ${
                    !notification.notificationRecipients[0].readStatus
                      ? "bg-primary/10"
                      : ""
                  }`}
                  onClick={() => markAsRead(notification.notificationId)}
                >
                  <div className="flex items-start justify-between">
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
            </div>
          ) : (
            <div className="py-8 px-4 text-center text-gray-500">
              {t("text.noNotifications")}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-1">
          <Link href={CUSTOMER_PATHS.notifications}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-primary hover:text-primary"
            >
              {t("button.viewAllNotifications")}
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
