import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type React from "react";
import "../globals.css";

import { inter } from "@/lib/fonts";

import { ReactQueryProvider } from "@/providers/reactQueryProvider";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  const messages: any = await getMessages();
  //const locale = await getLocale();
  // console.log(messages);
  // console.log(locale);

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
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable}`} suppressHydrationWarning>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="UTC"
        >
          <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ""}>
            <ReactQueryProvider>
              <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="beforeInteractive"
              />
              <Header />
              <Toaster closeButton richColors theme="light" />
              {children}
              <Footer />
            </ReactQueryProvider>
          </GoogleOAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
