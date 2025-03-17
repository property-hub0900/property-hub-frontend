"use client";

import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProtectedRoute } from "@/components/rbac/protected-route";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/hooks/useAuth";
import { ReactQueryProvider } from "@/providers/reactQueryProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50">
          <DashboardSidebar
            userType={user?.role === "staff" ? "company" : "customer"}
          />
          <div className="flex flex-1 flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
