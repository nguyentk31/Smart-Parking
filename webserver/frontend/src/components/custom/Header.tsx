import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMessage,
  DropdownNotification,
  DropdownUser,
  DarkModeButton,
} from "@/components";
import { Menu } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-99 flex w-full bg-background shadow-sm shadow-slate-200 dark:shadow-slate-800">
      <div className="flex flex-grow items-center justify-between py-3 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <div className="flex lg:hidden gap-x-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              size="icon"
              variant={"ghost"}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-2">
            <DarkModeButton />

            <DropdownNotification />

            <DropdownMessage />
          </ul>

          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
