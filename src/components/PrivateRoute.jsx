import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  if (user?.id) {
    return children;
  } else {
    return <Navigate to="/customer/login" state={{ from: location }} replace />;
  }
};

export default PrivateRoute;
