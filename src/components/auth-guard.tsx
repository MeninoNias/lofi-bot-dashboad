import { Navigate, Outlet } from "react-router";

import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard() {
  const apiKey = useAuthStore((state) => state.apiKey);

  if (!apiKey) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
