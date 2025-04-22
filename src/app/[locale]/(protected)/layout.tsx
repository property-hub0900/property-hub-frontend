"use client";

import { useState, useEffect, type ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProtectedRoute } from "@/components/rbac/protected-route";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAuthRefresh } from "@/lib/hooks/useAuthRefresh";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Use the auth refresh hook - this will automatically refresh user data
  useAuthRefresh();

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-state");
    if (savedState !== null) {
      setSidebarOpen(savedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  const handleSidebarChange = (open: boolean) => {
    setSidebarOpen(open);
    localStorage.setItem("sidebar-state", String(open));
  };

  return (
    <ProtectedRoute>
      <SidebarProvider open={sidebarOpen} onOpenChange={handleSidebarChange}>
        <div className="flex min-h-screen w-full bg-white">
          <DashboardSidebar
            userType={user?.role === "staff" ? "company" : "customer"}
          />
          <div className="flex-1 w-full max-w-full overflow-auto">
            <DashboardHeader />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
