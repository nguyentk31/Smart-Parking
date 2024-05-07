import { Link } from "react-router-dom";
import logo from "@/assets/react.svg";
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
import { MessageCircleMore } from "lucide-react";

const DropdownMessage = () => {
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
          <MessageCircleMore className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-999 w-[280px]">
        <DropdownMenuLabel>Messages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link className="flex gap-2.5" to="/messages">
              <div className="h-[46px] w-[46px] rounded-full border border-gray-200 flex items-center justify-center">
                <img src={logo} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Mariya Desoja
                </h6>
                <p className="text-sm">I like your confidence 💪</p>
                <p className="text-xs">2min ago</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMessage;
