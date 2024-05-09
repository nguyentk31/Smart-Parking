import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

const DropdownNotification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="relative flex h-9 w-9 items-center justify-center rounded-full"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <span className="absolute top-0.5 -right-0 z-1 h-2 w-2 rounded-full bg-[#DC3545]">
            <span className="absolute right-0 -z-1 inline-flex h-full w-full animate-ping rounded-full bg-[#DC3545] opacity-75"></span>
          </span>
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[280px] z-999" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link className="flex flex-col gap-2.5" to="#">
              <p className="text-sm">
                <span className="text-black dark:text-white">
                  Edit your information in a swipe
                </span>{" "}
                Sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim.
              </p>

              <p className="text-xs">12 May, 2025</p>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownNotification;
