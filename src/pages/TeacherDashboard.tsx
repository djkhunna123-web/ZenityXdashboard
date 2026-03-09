import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, MessageSquare, Star, ThumbsUp, Plus, Download, QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { mockClasses, mockFeedback, chartData } from "@/lib/mockData";
import { getSession } from "@/lib/session";

const TeacherDashboard = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [newClass, setNewClass] = useState({ classNumber: "", courseName: "" });
  const session = getSession();
  const teacherName = session?.teacherName;

  const myClasses = teacherName ? mockClasses.filter((c) => c.teacherName === teacherName) : [];
  const myClassIds = new Set(myClasses.map((classItem) => classItem.id));
  const recentFeedback = mockFeedback
    .filter((feedback) => myClassIds.has(feedback.classId))
    .slice(0, 4);
  const totalResponses = myClasses.reduce((a, c) => a + c.responseCount, 0);
  const avgSat = myClasses.length
    ? (myClasses.reduce((a, c) => a + c.avgSatisfaction, 0) / myClasses.length).toFixed(1)
    : "0.0";
  const avgRec = myClasses.length
    ? (myClasses.reduce((a, c) => a + c.avgRecommend, 0) / myClasses.length).toFixed(1)
    : "0.0";

  return (
    <DashboardLayout role="teacher">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">แดชบอร์ด</h1>
          <p className="text-sm text-muted-foreground">ยินดีต้อนรับ, {teacherName ?? session?.email ?? "อาจารย์"}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreate(true)}
          className="accent-gradient text-accent-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4" /> สร้างคลาสใหม่
        </motion.button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="คลาส" value={myClasses.length} delay={0} />
        <StatCard icon={MessageSquare} label="คำตอบ" value={totalResponses} delay={0.05} />
        <StatCard icon={Star} label="ความพึงพอใจเฉลี่ย" value={avgSat} sub="จาก 10" delay={0.1} />
        <StatCard icon={ThumbsUp} label="คะแนนแนะนำเฉลี่ย" value={avgRec} sub="จาก 10" delay={0.15} />
      </div>

      {/* Charts */}
      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">แนวโน้มความพึงพอใจ</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[6, 10]} tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "12px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="satisfaction" stroke="hsl(0 85% 58%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(0 85% 58%)" }} />
              <Line type="monotone" dataKey="recommend" stroke="hsl(0 0% 55%)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">จำนวนคำตอบต่อคลาส</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={myClasses.map((c) => ({ name: `#${c.classNumber}`, responses: c.responseCount }))}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="responses" fill="hsl(0 85% 58%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Classes Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h3 className="text-sm font-semibold">คลาสของฉัน</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border/30">
              <th className="text-left px-6 py-3 font-medium">คลาส</th>
              <th className="text-left px-6 py-3 font-medium">วิชา</th>
              <th className="text-left px-6 py-3 font-medium">วันที่</th>
              <th className="text-center px-6 py-3 font-medium">คำตอบ</th>
              <th className="text-center px-6 py-3 font-medium">ความพึงพอใจ</th>
              <th className="text-center px-6 py-3 font-medium">QR Code</th>
            </tr>
          </thead>
          <tbody>
            {myClasses.map((cls) => (
              <tr key={cls.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold">#{cls.classNumber}</td>
                <td className="px-6 py-4 text-sm">{cls.courseName}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{cls.date}</td>
                <td className="px-6 py-4 text-sm text-center">{cls.responseCount}</td>
                <td className="px-6 py-4 text-sm text-center font-semibold text-accent">{cls.avgSatisfaction}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => setSelectedQR(cls.id)} className="text-muted-foreground hover:text-accent transition-colors">
                    <QrCode className="w-4 h-4 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Comments */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6 mt-6">
        <h3 className="text-sm font-semibold mb-4">ความคิดเห็นล่าสุด</h3>
        <div className="space-y-3">
          {recentFeedback.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีความคิดเห็นสำหรับบัญชีนี้</p>
          ) : (
            recentFeedback.map((fb) => (
              <div key={fb.id} className="p-4 rounded-xl bg-secondary/20 border border-border/30">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs text-muted-foreground">{fb.anonymous ? "ไม่ระบุชื่อ" : fb.studentName}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{fb.satisfaction}/10</span>
                  </div>
                </div>
                <p className="text-sm">{fb.comment}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* QR Modal */}
      <AnimatePresence>
        {selectedQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedQR(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card relative mx-4 w-full max-w-sm p-6 text-center sm:p-8"
            >
              <button onClick={() => setSelectedQR(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold mb-2">QR Code</h3>
              <p className="text-sm text-muted-foreground mb-6">นักเรียนสแกนเพื่อส่ง Feedback</p>
              <div className="bg-background p-4 rounded-2xl inline-block mb-6">
                <QRCodeSVG value={`${window.location.origin}/feedback/${selectedQR}`} size={200} bgColor="transparent" fgColor="currentColor" className="text-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mb-4 break-all">{window.location.origin}/feedback/{selectedQR}</p>
              <button className="accent-gradient text-accent-foreground px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 mx-auto shadow-lg shadow-accent/20">
                <Download className="w-4 h-4" /> ดาวน์โหลด QR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card mx-4 w-full max-w-md p-6 sm:p-8"
            >
              <h3 className="text-lg font-bold mb-6">สร้างคลาสใหม่</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">หมายเลขคลาส</label>
                  <input
                    value={newClass.classNumber}
                    onChange={(e) => setNewClass({ ...newClass, classNumber: e.target.value })}
                    placeholder="เช่น 108"
                    className="w-full mt-2 bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ชื่อวิชา</label>
                  <input
                    value={newClass.courseName}
                    onChange={(e) => setNewClass({ ...newClass, courseName: e.target.value })}
                    placeholder="เช่น Advanced Neural Networks"
                    className="w-full mt-2 bg-secondary/30 border border-border/50 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl text-sm font-medium border border-border bg-secondary/30 hover:bg-secondary/50 transition-all">
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="flex-1 accent-gradient text-accent-foreground py-3 rounded-xl text-sm font-bold shadow-lg shadow-accent/20"
                  >
                    สร้างคลาส
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
