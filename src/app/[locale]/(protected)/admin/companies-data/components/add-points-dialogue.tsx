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
  companyId: number;
  isAddPointsDialogOpen: boolean;
  setIsAddPointsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddPointsDialogue = ({
  companyId,
  isAddPointsDialogOpen,
  setIsAddPointsDialogOpen,
}: IAddPointsDialogueProps) => {
  const t = useTranslations();

  const queryClient = useQueryClient();

  const schema = useMemo(() => updateCompanyPointsSchema(t), [t]);

  const form = useForm<TUpdateCompanyPointsSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      //points: "",
      description: "",
    },
  });

  const addCompanyPointsMutation = useMutation({
    mutationFn: adminServices.addCompanyPoints,
  });

  async function onSubmit(data: TUpdateCompanyPointsSchema) {
    try {
      const payloads = {
        companyId: companyId,
        data: {
          type: "add",
          ...data,
        },
      };
      const response = await addCompanyPointsMutation.mutateAsync(payloads);
      queryClient.invalidateQueries({
        queryKey: ["adminCompanies"],
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
            <DialogTitle>{t("button.addPoints")}</DialogTitle>
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
                    disabled={addCompanyPointsMutation.isPending}
                    type="submit"
                    size={"sm"}
                    //onClick={() => handleCustomSubmit}
                  >
                    {t("button.addPoints")}
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
