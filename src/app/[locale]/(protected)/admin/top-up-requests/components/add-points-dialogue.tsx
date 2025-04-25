"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  TUpdateCompanyPointsSchema,
  updateCompanyPointsSchema,
} from "@/schema/protected/properties";
import { adminServices } from "@/services/protected/admin";
import { getErrorMessage } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IAddPointsDialogueProps {
  points: number;
  transactionId: number;
  isAddPointsDialogOpen: boolean;
  setIsAddPointsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddPointsDialogue = ({
  points,
  transactionId,
  isAddPointsDialogOpen,
  setIsAddPointsDialogOpen,
}: IAddPointsDialogueProps) => {
  const t = useTranslations();

  const queryClient = useQueryClient();

  const schema = useMemo(() => updateCompanyPointsSchema(t), [t]);

  const form = useForm<TUpdateCompanyPointsSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      points: points,
      description: "",
    },
  });

  const approveTopUpPointsMutation = useMutation({
    mutationFn: adminServices.approveTopUpPoints,
  });

  async function onSubmit(data: TUpdateCompanyPointsSchema) {
    try {
      const response = await approveTopUpPointsMutation.mutateAsync(
        transactionId
      );
      queryClient.invalidateQueries({
        queryKey: ["getAdminPoints"],
      });
      form.reset();
      toast.success(response.message);
      setIsAddPointsDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <>
      <Dialog
        open={isAddPointsDialogOpen}
        onOpenChange={setIsAddPointsDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("sidebar.topUpPoints")}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="py-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.points.label")}
                        <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder=""
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.description.label")}
                        <span>*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant={"secondary"}
                    size={"sm"}
                    onClick={() => setIsAddPointsDialogOpen(false)}
                  >
                    {t("button.cancel")}
                  </Button>
                  <Button
                    disabled={approveTopUpPointsMutation.isPending}
                    type="submit"
                    size={"sm"}
                    //onClick={() => handleCustomSubmit}
                  >
                    {t("button.submit")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
