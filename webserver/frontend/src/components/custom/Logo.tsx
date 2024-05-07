import { Link } from "react-router-dom";
import { Icons } from "@/utils/icon";

const Logo = () => {
  return (
    <Link to="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden xl:flex">
        <Icons.logo className="h-8 w-8" />
        <p className="text-lg pb-1 font-medium ">Demo App</p>
      </div>
    </Link>
  );
};

export default Logo;
