import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/context/store/store";

const UserProtect = ({ children }: { children: React.ReactNode }) => {
  const auth = useSelector((state: RootState) => state.auth);
  function IsAuthenticated() {
    if (auth.token && auth.user.role === "user") {
      return true;
    }
    return false;
  }
  if (IsAuthenticated()) {
    return <div>{children}</div>;
  } else {
    if (auth.token) {
      return <Navigate to="/auth/login" />;
    } else {
      return <Navigate to="/" />;
    }
  }
};

export default UserProtect;
