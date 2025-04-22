"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { saveSearchSchema, TSaveSearchSchema } from "@/schema/public";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { propertyServices } from "@/services/public/properties";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/utils";

export const AddPointsDialogue = () => {
  const t = useTranslations();

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const schema = useMemo(() => saveSearchSchema(t), [t]);

  const form = useForm<TSaveSearchSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      searchTitle: "",
    },
  });

  const customerSaveSearchMutation = useMutation({
    mutationFn: propertyServices.customerSaveSearch,
  });

  async function onSubmit(data: TSaveSearchSchema) {
    try {
      const payloads = {
        searchQuery: "",
        searchTitle: data.searchTitle,
      };
      const response = await customerSaveSearchMutation.mutateAsync(payloads);
      triggerRef.current?.click();
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          ref={triggerRef}
          size={"sm"}
          className="h-10 mt-5"
          type="button"
        >
          {t("button.addPoints")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("button.addPoints")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="py-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="searchTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("button.addPoints")}
                      <span>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-end">
                <Button
                  disabled={customerSaveSearchMutation.isPending}
                  type="button"
                  size={"sm"}
                >
                  {t("button.addPoints")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
