import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, User, Building2 } from "lucide-react";
import { toast } from "sonner";
import { ZenityXLogo } from "@/components/ZenityXLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

const LoginPageReal = () => {
  const { signIn, signUpTeacher } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUpTeacher({ email, password, fullName, department });
        toast.success("สร้างบัญชีอาจารย์เรียบร้อยแล้ว กรุณายืนยันอีเมล และรอผู้ดูแลระบบอนุมัติก่อนเข้าใช้งาน");
        setMode("login");
        setPassword("");
      } else {
        await signIn(email, password);
        toast.success("เข้าสู่ระบบเรียบร้อยแล้ว");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]" />

      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <ZenityXLogo size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "เข้าสู่ระบบเพื่อใช้งานแดชบอร์ด" : "สมัครบัญชีอาจารย์เพื่อรอการอนุมัติ"}
          </p>
        </div>

        <div className="glass-card p-8">
          {!isSupabaseConfigured && (
            <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              โปรดตั้งค่า `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY` ก่อนใช้งานระบบจริง
            </div>
          )}

          <div className="mb-5 flex gap-2 rounded-xl bg-secondary/30 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === "login" ? "border border-accent/20 bg-accent/10 text-accent" : "text-muted-foreground"
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                mode === "signup" ? "border border-accent/20 bg-accent/10 text-accent" : "text-muted-foreground"
              }`}
            >
              สมัครอาจารย์
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">ชื่อ-นามสกุล</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border/50 bg-secondary/30 py-3 pl-11 pr-4 text-sm transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">แผนก</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="เช่น AI & Machine Learning"
                      required
                      className="w-full rounded-xl border border-border/50 bg-secondary/30 py-3 pl-11 pr-4 text-sm transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@zenityx.com"
                  required
                  className="w-full rounded-xl border border-border/50 bg-secondary/30 py-3 pl-11 pr-4 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  minLength={6}
                  required
                  className="w-full rounded-xl border border-border/50 bg-secondary/30 py-3 pl-11 pr-4 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl accent-gradient py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-5 w-5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground"
                />
              ) : (
                <>
                  {mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี"} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            บัญชีแอดมินควรสร้างและกำหนดสิทธิ์ใน Supabase แยกต่างหาก ส่วนบัญชีอาจารย์จากหน้านี้จะอยู่ในสถานะรออนุมัติจนกว่าผู้ดูแลระบบจะอนุมัติ
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            กลับหน้าหลัก
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPageReal;
