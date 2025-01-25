// src/components/common/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check if token exists in localStorage but not in state
    const localToken = localStorage.getItem("token");
    if (localToken && !token) {
      window.location.reload();
    }
  }, [token]);

  if (!isAuthenticated && !localStorage.getItem("token")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
