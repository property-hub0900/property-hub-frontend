import { Toaster } from "@/components/ui/sonner";
import { inter } from "@/lib/fonts";
import { ReactQueryProvider } from "@/providers/reactQueryProvider";
import { getDirection } from "@/utils/rtl";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Script from "next/script";
import type React from "react";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const messages: any = await getMessages();
  //const locale = await getLocale();
  //
  //

  return {
    title: messages.seo.title,
    description: messages.seo.description,
    openGraph: {
      title: messages.seo.ogTitle,
      description: messages.seo.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: messages.seo.twitterTitle,
      description: messages.seo.twitterDescription,
    },
    other: {
      charset: "UTF-8",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} dir={getDirection(locale)} suppressHydrationWarning>
      <body className={`${inter.variable}`} suppressHydrationWarning>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="UTC"
        >
          <ReactQueryProvider>
            <Script
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
              strategy="beforeInteractive"
            />
            <Toaster closeButton richColors theme="light" />
            {children}
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
