import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/context/store/store";
import { toast } from "react-toastify";

const AdminProtect = ({ children }: { children: React.ReactNode }) => {
  const auth = useSelector((state: RootState) => state.auth);
  function IsAuthenticated() {
    if (auth.token && auth.user.role === "admin") {
      return true;
    }
    return false;
  }
  if (IsAuthenticated()) {
    return <div>{children}</div>;
  } else {
    if (auth.token) {
      setTimeout(() => {
        toast.error("You are not authorized to access this page");
      }, 1000);
      return <Navigate to="/" />;
    } else {
      setTimeout(() => {
        toast.error("You need to login to access this page");
      }, 1000);
      return <Navigate to="/auth/login" />;
    }
  }
};

export default AdminProtect;
