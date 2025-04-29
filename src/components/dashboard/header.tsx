import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { UserMenu } from "../layout/userMenu";
import NotificationDropdown from "./notifications";
import { useRBAC } from "@/lib/hooks/useRBAC";
import { USER_ROLES } from "@/constants/rbac";

export function DashboardHeader() {
  const { currentRole } = useRBAC();

  return (
    <header className="flex h-16 items-center justify-between border-b p-12 md:px-6 bg-white">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden mr-2" />

        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        {currentRole === USER_ROLES.CUSTOMER && <NotificationDropdown />}

        <UserMenu />
      </div>
    </header>
  );
}
