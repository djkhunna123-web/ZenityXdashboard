import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthRedirect } from "@/components/AuthRedirect";
import Index from "./pages/Index";
import FeedbackPage from "./pages/FeedbackPageReal";
import LoginPage from "./pages/LoginPageReal";
import TeacherDashboard from "./pages/TeacherDashboardReal";
import TeacherClasses from "./pages/TeacherClassesReal";
import AdminDashboard from "./pages/AdminDashboardReal";
import AdminTeachers from "./pages/AdminTeachersReal";
import AdminClasses from "./pages/AdminClassesReal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/feedback/:classId" element={<FeedbackPage />} />
              <Route
                path="/login"
                element={
                  <AuthRedirect>
                    <LoginPage />
                  </AuthRedirect>
                }
              />
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/classes"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherClasses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers"
                element={
                  <ProtectedRoute role="admin">
                    <AdminTeachers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/classes"
                element={
                  <ProtectedRoute role="admin">
                    <AdminClasses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
