import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Users, BarChart3, LogOut } from "lucide-react";
import { toast } from "sonner";
import { ZenityXLogo } from "@/components/ZenityXLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: ReactNode;
  role: "teacher" | "admin";
}

const teacherNav = [
  { to: "/teacher", icon: LayoutDashboard, label: "\u0e41\u0e14\u0e0a\u0e1a\u0e2d\u0e23\u0e4c\u0e14" },
  { to: "/teacher/classes", icon: BookOpen, label: "\u0e04\u0e25\u0e32\u0e2a" },
];

const adminNav = [
  { to: "/admin", icon: LayoutDashboard, label: "\u0e41\u0e14\u0e0a\u0e1a\u0e2d\u0e23\u0e4c\u0e14" },
  { to: "/admin/teachers", icon: Users, label: "\u0e2d\u0e32\u0e08\u0e32\u0e23\u0e22\u0e4c" },
  { to: "/admin/classes", icon: BookOpen, label: "\u0e04\u0e25\u0e32\u0e2a" },
  { to: "/admin/analytics", icon: BarChart3, label: "\u0e27\u0e34\u0e40\u0e04\u0e23\u0e32\u0e30\u0e2b\u0e4c" },
];

export const DashboardLayoutAuth = ({ children, role }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const nav = role === "admin" ? adminNav : teacherNav;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e23\u0e30\u0e1a\u0e1a\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <aside className="w-full border-b border-border/50 bg-card/30 backdrop-blur-xl p-4 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-5">
        <div className="mb-4 lg:mb-8">
          <ZenityXLogo size="sm" />
          <p className="mt-1 text-xs text-muted-foreground">
            {role === "admin" ? "\u0e1c\u0e39\u0e49\u0e14\u0e39\u0e41\u0e25\u0e23\u0e30\u0e1a\u0e1a" : "\u0e2d\u0e32\u0e08\u0e32\u0e23\u0e22\u0e4c"}
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-1 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-visible lg:pb-0">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "border border-accent/20 bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-4 lg:block lg:space-y-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            {"\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e23\u0e30\u0e1a\u0e1a"}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
