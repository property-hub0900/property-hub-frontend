import { z } from "zod";
import { commonValidations } from "../commonValidations";

export const saveSearchSchema = (t: (key: string) => string) =>
  z.object({
    searchTitle: commonValidations.stringRequired(t("form.required")),
  });

export type TSaveSearchSchema = z.infer<ReturnType<typeof saveSearchSchema>>;
