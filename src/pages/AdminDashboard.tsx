import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Star, Users, Search, Download, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { mockClasses, mockTeachers, mockFeedback, chartData } from "@/lib/mockData";

const AdminDashboard = () => {
  const [search, setSearch] = useState("");
  const totalResponses = mockClasses.reduce((a, c) => a + c.responseCount, 0);
  const avgSat = (mockClasses.reduce((a, c) => a + c.avgSatisfaction, 0) / mockClasses.length).toFixed(1);

  const filteredFeedback = mockFeedback.filter((f) =>
    f.comment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-sm text-muted-foreground">ภาพรวมและการวิเคราะห์ทั้งสถาบัน</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border bg-card/50 hover:bg-secondary/50 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> ส่งออก CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="คลาสทั้งหมด" value={mockClasses.length} delay={0} />
        <StatCard icon={MessageSquare} label="คำตอบทั้งหมด" value={totalResponses} delay={0.05} />
        <StatCard icon={Star} label="ความพึงพอใจเฉลี่ย" value={avgSat} sub="จาก 10" delay={0.1} />
        <StatCard icon={Users} label="อาจารย์" value={mockTeachers.length} delay={0.15} />
      </div>

      {/* Charts */}
      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4">แนวโน้มความพึงพอใจ (ทั้งสถาบัน)</h3>
          <ResponsiveContainer width="100%" height={220}>
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
          <h3 className="text-sm font-semibold mb-4">การกระจายคะแนน</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockClasses.map((c) => ({ name: `#${c.classNumber}`, satisfaction: c.avgSatisfaction, recommend: c.avgRecommend }))}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="satisfaction" fill="hsl(0 85% 58%)" radius={[4, 4, 0, 0]} name="ความพึงพอใจ" />
              <Bar dataKey="recommend" fill="hsl(0 0% 35%)" radius={[4, 4, 0, 0]} name="แนะนำ" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Teachers */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden mb-6">
        <div className="p-6 border-b border-border/50 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold">อาจารย์คะแนนสูงสุด</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border/30">
              <th className="text-left px-6 py-3 font-medium">ชื่อ</th>
              <th className="text-left px-6 py-3 font-medium">อีเมล</th>
              <th className="text-center px-6 py-3 font-medium">คลาส</th>
              <th className="text-center px-6 py-3 font-medium">คะแนนเฉลี่ย</th>
            </tr>
          </thead>
          <tbody>
            {[...mockTeachers].sort((a, b) => b.avgScore - a.avgScore).map((t) => (
              <tr key={t.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold">{t.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{t.email}</td>
                <td className="px-6 py-4 text-sm text-center">{t.classCount}</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-accent">{t.avgScore}</span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </motion.div>

      {/* All Feedback with Search */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold">ความคิดเห็นทั้งหมด</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาความคิดเห็น..."
              className="w-full bg-secondary/30 border border-border/50 rounded-xl pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            />
          </div>
        </div>
        <div className="space-y-3">
          {filteredFeedback.map((fb) => (
            <div key={fb.id} className="p-4 rounded-xl bg-secondary/20 border border-border/30">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-muted-foreground">{fb.anonymous ? "ไม่ระบุชื่อ" : fb.studentName}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">พึงพอใจ: {fb.satisfaction}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">แนะนำ: {fb.recommend}</span>
                </div>
              </div>
              <p className="text-sm">{fb.comment}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
