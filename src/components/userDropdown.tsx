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
import { useRouter } from "next/navigation";

export const UserDropdown = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const getUserName = () => {
    if (user) {
      return user.loginMethod == "google" ? `${user.email}` : user.username as string;
    }
  }



  return (
    <div className="">
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <div className="flex gap-2 items-center cursor-pointer">
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.imageUrl} alt={getUserName()} />
              <AvatarFallback>
                {getUserName()?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="capitalize">{getUserName()}</span>




          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel onClick={() => { router.push(`${user?.role === 'staff' ? '/company' : '/customer'}/dashboard`) }}>My Account</DropdownMenuLabel>
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
