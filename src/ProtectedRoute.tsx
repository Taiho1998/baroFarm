import useUserStore from "@zustand/useUserStore";
import PropTypes from "prop-types";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

ProtectedRoute.propTypes = {
  children: PropTypes.element,
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useUserStore((store) => store?.user);
  return user ? <>{children}</> : <Navigate to="/users/login" />;
}
