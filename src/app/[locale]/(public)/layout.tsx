import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type React from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ""}>
        <Header />
        {children}
        <Footer />
      </GoogleOAuthProvider>
    </>
  );
}
