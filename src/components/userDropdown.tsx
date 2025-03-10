import { LogOut } from "lucide-react";

//Settings,
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const UserDropdown = () => {
  const { user, logOut } = useAuth();

  const getUserName = () => {
    if (user) {
      return user.loginMethod == "google" ? `${user.email}` : user.username as string;
    }
  }

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-2 items-center">
            <span className="capitalize">{getUserName()}</span>
            <Avatar className="cursor-pointer">
              <AvatarImage src={""} alt={getUserName()} />
              <AvatarFallback>
                {getUserName()?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={logOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
