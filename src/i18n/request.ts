import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }: any) => {
  const locale = await requestLocale;
  return {
    messages: (await import(`./translations/${locale ? locale : "en"}.json`))
      .default,
    locale,
  };
});
