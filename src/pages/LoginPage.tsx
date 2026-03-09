import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { ZenityXLogo } from "@/components/ZenityXLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createSession, saveSession } from "@/lib/session";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const session = createSession(email);
      saveSession(session);

      if (session.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/teacher");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <ZenityXLogo size="lg" />
          </div>
          <p className="text-muted-foreground text-sm">เข้าสู่ระบบแดชบอร์ดของคุณ</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@zenityx.com"
                  required
                  className="w-full bg-secondary/30 border border-border/50 rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-secondary/30 border border-border/50 rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full accent-gradient text-accent-foreground py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-accent/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                />
              ) : (
                <>
                  เข้าสู่ระบบ <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            ใช้ <span className="text-foreground font-medium">admin@zenityx.com</span> สำหรับแอดมิน หรืออีเมลอื่นสำหรับอาจารย์
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← กลับหน้าหลัก
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
