import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({
  children,
  role,
}: {
  children: ReactNode;
  role?: "admin" | "teacher";
}) => {
  const { loading, session, profile } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">Profile not found. Please check your Supabase setup.</div>;
  }

  if (profile.role === "teacher" && profile.status !== "approved") {
    return <Navigate to="/login" replace />;
  }

  if (role && profile?.role !== role) {
    const fallback = profile?.role === "admin" ? "/admin" : "/teacher";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};
