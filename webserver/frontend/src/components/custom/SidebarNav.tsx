import { useRef, useEffect, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  CircleParking,
  Home,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Icons } from "@/utils/icon";

interface SidebarNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const SidebarNav = ({ sidebarOpen, setSidebarOpen }: SidebarNavProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const handleResize = useCallback(() => {
    if (window.innerWidth > 1024) setSidebarOpen(false);
  }, [setSidebarOpen]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      className={`fixed shadow-lg left-0 top-0 z-999 bg-background flex h-screen w-72 flex-col overflow-y-hidden duration-150 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-4 lg:px-6 py-5 lg:py-6">
        <Link to="#">
          <div className="hover:opacity-75 transition flex justify-center items-center gap-x-2 ">
            <Icons.logo className="w-8 h-8" />
            <p className="text-lg pb-1 font-medium">Demo App</p>
          </div>
        </Link>

        <Button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          size="icon"
          variant="ghost"
          className="flex items-center justify-center xl:hidden"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="py-4 px-3 lg:px-5">
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink
              to="/"
              className={`flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  hover:bg-neutral-500/10 duration-75 ease-in-out  ${
                pathname === "/" && "bg-neutral-500/10"
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/parking"
              className={`flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  hover:bg-neutral-500/10 duration-75 ease-in-out  ${
                pathname.includes("parking") && "bg-neutral-500/10"
              }`}
            >
              <CircleParking className="w-5 h-5" />
              Parking
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/blog"
              className={`flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  hover:bg-neutral-500/10 duration-75 ease-in-out  ${
                pathname.includes("blog") && "bg-neutral-500/10"
              }`}
            >
              <SquareArrowOutUpRight className="w-5 h-5" />
              Blog
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SidebarNav;
