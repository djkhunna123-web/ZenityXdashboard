import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, BarChart3, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { ZenityXLogo } from "@/components/ZenityXLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  { icon: MessageSquare, title: "แบบประเมินไม่ระบุชื่อ", desc: "ให้นักเรียนแชร์ความคิดเห็นอย่างตรงไปตรงมาได้อย่างสบายใจ" },
  { icon: BarChart3, title: "วิเคราะห์ผลแบบเรียลไทม์", desc: "ดูคะแนนและข้อเสนอแนะของแต่ละคลาสได้ทันทีในแดชบอร์ด" },
  { icon: Shield, title: "ปลอดภัยและเป็นส่วนตัว", desc: "จัดการสิทธิ์ผู้ใช้งานและข้อมูลการประเมินได้อย่างเป็นระบบ" },
];

const Index = () => (
  <div className="relative min-h-screen overflow-hidden bg-background">
    <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]" />

    <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <ZenityXLogo />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            เข้าสู่ระบบ
          </motion.button>
        </Link>
      </div>
    </nav>

    <main className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          ระบบติดตาม Feedback สำหรับคลาสเรียนของ ZenityX
        </motion.div>

        <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
          ยกระดับการเรียนการสอนด้วย
          <span className="accent-gradient-text"> Feedback ที่ใช้งานได้จริง</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-balance text-lg text-muted-foreground">
          เก็บแบบประเมินจากนักเรียนผ่านลิงก์หรือ QR Code แล้วดูภาพรวมคะแนน ความคิดเห็น และข้อเสนอแนะเพื่อพัฒนาคลาสได้ในที่เดียว
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-xl accent-gradient px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20"
            >
              เปิดแดชบอร์ด <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-border bg-card/50 px-8 py-3.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-secondary/50"
            >
              สำหรับอาจารย์และแอดมิน
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-28 grid gap-6 md:grid-cols-3"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="glass-card-hover p-8"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl accent-gradient">
              <f.icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  </div>
);

export default Index;
