import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, BookOpen, Hash, CheckCircle2 } from "lucide-react";
import { ZenityXLogo } from "@/components/ZenityXLogo";
import { SatisfactionRating } from "@/components/SatisfactionRating";
import { ThemeToggle } from "@/components/ThemeToggle";
import { mockClasses } from "@/lib/mockData";

const FeedbackPage = () => {
  const { classId } = useParams();
  const classData = mockClasses.find((c) => c.id === classId) || mockClasses[0];

  const [satisfaction, setSatisfaction] = useState(0);
  const [recommend, setRecommend] = useState(0);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (satisfaction === 0 || recommend === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <ZenityXLogo size="sm" />
          <ThemeToggle />
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full accent-gradient flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/30"
              >
                <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold mb-3"
              >
                ขอบคุณครับ/ค่ะ!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground max-w-md mx-auto"
              >
                ขอบคุณที่ช่วยให้ ZenityX พัฒนาคลาสเรียนให้ดียิ่งขึ้น ความคิดเห็นของคุณมีค่ามาก
              </motion.p>
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    y: -100 - Math.random() * 200,
                    x: (Math.random() - 0.5) * 300,
                    scale: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 1.5, delay: 0.2 + i * 0.05 }}
                  className="absolute left-1/2 top-1/3 w-3 h-3 rounded-sm"
                  style={{
                    background: i % 3 === 0 ? "hsl(0 85% 58%)" : i % 3 === 1 ? "hsl(350 85% 50%)" : "hsl(0 0% 60%)",
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Class Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 mb-8"
              >
                <h2 className="text-lg font-bold mb-4">ข้อมูลคลาส</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Hash, label: "คลาส", value: `#${classData.classNumber}` },
                    { icon: User, label: "อาจารย์", value: classData.teacherName },
                    { icon: BookOpen, label: "วิชา", value: classData.courseName },
                    { icon: Calendar, label: "วันที่", value: classData.date },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-semibold">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Feedback Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6"
                >
                  <SatisfactionRating value={satisfaction} onChange={setSatisfaction} label="คุณพึงพอใจกับคลาสนี้มากแค่ไหน?" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6"
                >
                  <SatisfactionRating value={recommend} onChange={setRecommend} label="คุณจะแนะนำคลาสนี้ให้เพื่อนหรือไม่?" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6 space-y-4"
                >
                  <label className="text-sm font-medium">ข้อเสนอแนะเพิ่มเติม</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="แบ่งปันความคิดเห็นของคุณเพื่อช่วยให้เราพัฒนาได้ดียิ่งขึ้น..."
                    rows={4}
                    className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all resize-none"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-6 space-y-4"
                >
                  <label className="text-sm font-medium">ตัวตน</label>
                  <div className="flex gap-3">
                    {[
                      { val: true, label: "ส่งแบบไม่ระบุชื่อ" },
                      { val: false, label: "ระบุชื่อของคุณ" },
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => setAnonymous(opt.val)}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                          anonymous === opt.val
                            ? "bg-accent/10 border-accent/30 text-accent"
                            : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-accent/20"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {!anonymous && (
                      <motion.input
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="กรอกชื่อของคุณ..."
                        className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={satisfaction === 0 || recommend === 0 || submitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full accent-gradient text-accent-foreground py-4 rounded-xl font-bold text-sm shadow-lg shadow-accent/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                    />
                  ) : (
                    "ส่ง Feedback"
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeedbackPage;
