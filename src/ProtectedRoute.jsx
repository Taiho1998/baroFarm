import useUserStore from "@zustand/useUserStore";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

ProtectedRoute.propTypes = {
  children: PropTypes.element,
};

export default function ProtectedRoute({ children }) {
  const user = useUserStore((store) => store.user);
  return user ? <>{children}</> : <Navigate to="/users/login" />;
}
