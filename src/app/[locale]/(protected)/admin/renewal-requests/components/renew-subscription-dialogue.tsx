"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

import { TUpdateCompanyPointsSchema } from "@/schema/protected/properties";
import { adminServices } from "@/services/protected/admin";
import { getErrorMessage } from "@/utils/utils";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { toast } from "sonner";

interface IAddPointsDialogueProps {
  subscriptionId: number;
  isRenewSubscriptionDialogOpen: boolean;
  setIsRenewSubscriptionDialogOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const RenewSubscriptionDialogue = ({
  subscriptionId,
  isRenewSubscriptionDialogOpen,
  setIsRenewSubscriptionDialogOpen,
}: IAddPointsDialogueProps) => {
  const t = useTranslations();

  const queryClient = useQueryClient();

  const approveRenewalSubscriptionMutation = useMutation({
    mutationFn: adminServices.approveRenewalSubscription,
  });

  const handleRenewSubscription = async () => {
    try {
      const response = await approveRenewalSubscriptionMutation.mutateAsync(
        subscriptionId
      );
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptions"],
      });

      toast.success(response.message);
      setIsRenewSubscriptionDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Dialog
        open={isRenewSubscriptionDialogOpen}
        onOpenChange={setIsRenewSubscriptionDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("title.paymentReceipt")}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="space-y-5">
            <div>
              <Image
                className="w-full"
                width={400}
                height={600}
                src={`/receiptImg.jpg`}
                alt="#d"
              ></Image>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={"secondary"}
                size={"sm"}
                onClick={() => setIsRenewSubscriptionDialogOpen(false)}
              >
                {t("button.cancel")}
              </Button>
              <Button
                disabled={approveRenewalSubscriptionMutation.isPending}
                type="button"
                size={"sm"}
                onClick={handleRenewSubscription}
              >
                {t("button.renewSubscription")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
