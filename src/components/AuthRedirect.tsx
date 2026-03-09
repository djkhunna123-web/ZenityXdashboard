import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const AuthRedirect = ({ children }: { children: ReactNode }) => {
  const { loading, session, profile } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">Loading...</div>;
  }

  if (session) {
    const target = profile?.role === "admin" ? "/admin" : "/teacher";
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
