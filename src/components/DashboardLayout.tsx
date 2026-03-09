import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ZenityXLogo } from "./ZenityXLogo";
import { ThemeToggle } from "./ThemeToggle";
import { LayoutDashboard, BookOpen, Users, BarChart3, LogOut } from "lucide-react";
import { clearSession } from "@/lib/session";

interface Props {
  children: ReactNode;
  role: "teacher" | "admin";
}

const teacherNav = [
  { to: "/teacher", icon: LayoutDashboard, label: "แดชบอร์ด" },
  { to: "/teacher/classes", icon: BookOpen, label: "คลาส" },
];

const adminNav = [
  { to: "/admin", icon: LayoutDashboard, label: "แดชบอร์ด" },
  { to: "/admin/teachers", icon: Users, label: "อาจารย์" },
  { to: "/admin/classes", icon: BookOpen, label: "คลาส" },
  { to: "/admin/analytics", icon: BarChart3, label: "วิเคราะห์" },
];

export const DashboardLayout = ({ children, role }: Props) => {
  const location = useLocation();
  const nav = role === "admin" ? adminNav : teacherNav;

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <aside className="w-full border-b border-border/50 bg-card/30 backdrop-blur-xl p-4 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-5">
        <div className="mb-4 lg:mb-8">
          <ZenityXLogo size="sm" />
          <p className="text-xs text-muted-foreground mt-1">{role === "admin" ? "ผู้ดูแลระบบ" : "อาจารย์"}</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-1 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-visible lg:pb-0">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`flex min-w-max items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-4 lg:block lg:space-y-2">
          <ThemeToggle />
          <Link to="/" onClick={clearSession}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </div>
          </Link>
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
