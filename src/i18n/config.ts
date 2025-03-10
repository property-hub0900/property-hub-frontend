import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }: any) => {
  if (!locales.includes(requestLocale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./translations/${requestLocale}.json`)).default,
    locale: requestLocale,
  };
});
