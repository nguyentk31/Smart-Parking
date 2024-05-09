import { DarkModeButton, DropdownUser, Logo, SearchBar } from "@/components";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  NavLink,
  useLocation,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store/store";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="sticky top-0 w-full max-w-[1920px] z-9 shadow-sm mx-auto xl:px-20 md:px-10 px-4 py-2 border-b bg-slate-200 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-x-8">
        <div className="flex gap-x-4 items-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            size="icon"
            variant={"ghost"}
            className="xl:hidden flex"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <Logo />
        </div>
        <div className="hidden xl:flex items-center gap-x-1">
          <NavLink
            to="/"
            className={`min-w-[80px] text-center font-medium rounded-md py-2 px-3 hover:bg-slate-300 dark:hover:bg-slate-600 duration-75 ease-in-out ${
              pathname === "/" && "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            Home
          </NavLink>
          <NavLink
            to="/parking"
            className={`min-w-[80px] text-center font-medium rounded-md py-2 px-3 hover:bg-slate-300 dark:hover:bg-slate-600 duration-75 ease-in-out ${
              pathname.includes("parking") && "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            Parking
          </NavLink>
          <NavLink
            to="/blog"
            className={`min-w-[80px] text-center font-medium rounded-md py-2 px-3 hover:bg-slate-300 dark:hover:bg-slate-600 duration-75 ease-in-out ${
              pathname.includes("blog") && "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            Blog
          </NavLink>
        </div>
        <SearchBar />

        <div className="flex items-center gap-x-3">
          <DarkModeButton />
          {auth.token ? (
            <DropdownUser />
          ) : (
            <Button onClick={() => navigate("/auth/login")} variant={"outline"}>
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
