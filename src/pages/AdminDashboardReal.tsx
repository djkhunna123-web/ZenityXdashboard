import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookOpen, Download, MessageSquare, Search, Star, TrendingUp, Users } from "lucide-react";
import { DashboardLayoutAuth } from "@/components/DashboardLayoutAuth";
import { StatCard } from "@/components/StatCard";
import { buildChartData, buildTeacherSummaries, fetchAllClasses, fetchTeachers } from "@/lib/supabase-data";

const AdminDashboardReal = () => {
  const [search, setSearch] = useState("");
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["all-classes"],
    queryFn: fetchAllClasses,
  });
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const chartData = buildChartData(classes);
  const teacherSummaries = useMemo(() => buildTeacherSummaries(teachers, classes), [teachers, classes]);
  const feedback = useMemo(
    () => classes.flatMap((item) => item.feedback).filter((item) => item.comment.toLowerCase().includes(search.toLowerCase())),
    [classes, search]
  );

  const totalResponses = classes.reduce((total, item) => total + item.responseCount, 0);
  const avgSat = classes.length
    ? (classes.reduce((total, item) => total + item.avgSatisfaction, 0) / classes.length).toFixed(1)
    : "0.0";

  return (
    <DashboardLayoutAuth role="admin">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-sm text-muted-foreground">ภาพรวมคลาส อาจารย์ และความคิดเห็นล่าสุดจากผู้เรียน</p>
        </div>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-secondary/50">
          <Download className="h-4 w-4" /> ส่งออก CSV
        </button>
      </div>

      {classesLoading || teachersLoading ? (
        <div className="glass-card p-8 text-center text-sm text-muted-foreground">กำลังโหลดข้อมูลแดชบอร์ด...</div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={BookOpen} label="จำนวนคลาสทั้งหมด" value={classes.length} delay={0} />
            <StatCard icon={MessageSquare} label="จำนวนคำตอบทั้งหมด" value={totalResponses} delay={0.05} />
            <StatCard icon={Star} label="คะแนนพึงพอใจเฉลี่ย" value={avgSat} sub="จาก 10" delay={0.1} />
            <StatCard icon={Users} label="จำนวนอาจารย์" value={teachers.length} delay={0.15} />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h3 className="mb-4 text-sm font-semibold">แนวโน้มคะแนนความพึงพอใจรายคลาส</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "12px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="satisfaction" stroke="hsl(0 85% 58%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(0 85% 58%)" }} />
                  <Line type="monotone" dataKey="recommend" stroke="hsl(0 0% 55%)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
              <h3 className="mb-4 text-sm font-semibold">เปรียบเทียบคะแนนของแต่ละคลาส</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={classes.map((item) => ({ name: `#${item.classNumber}`, satisfaction: item.avgSatisfaction, recommend: item.avgRecommend }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="satisfaction" fill="hsl(0 85% 58%)" radius={[4, 4, 0, 0]} name="ความพึงพอใจ" />
                  <Bar dataKey="recommend" fill="hsl(0 0% 35%)" radius={[4, 4, 0, 0]} name="การแนะนำ" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card mb-6 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border/50 p-6">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold">อันดับอาจารย์ตามคะแนนเฉลี่ย</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-border/30 text-xs text-muted-foreground">
                    <th className="px-6 py-3 text-left font-medium">ชื่อ</th>
                    <th className="px-6 py-3 text-left font-medium">อีเมล</th>
                    <th className="px-6 py-3 text-center font-medium">คลาส</th>
                    <th className="px-6 py-3 text-center font-medium">คะแนนเฉลี่ย</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherSummaries.sort((a, b) => b.avgScore - a.avgScore).map((teacher) => (
                    <tr key={teacher.id} className="border-b border-border/20 transition-colors hover:bg-secondary/20">
                      <td className="px-6 py-4 text-sm font-semibold">{teacher.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{teacher.email}</td>
                      <td className="px-6 py-4 text-center text-sm">{teacher.classCount}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-accent">{teacher.avgScore.toFixed(1)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold">ความคิดเห็นล่าสุด</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาความคิดเห็น..."
                  className="w-full rounded-xl border border-border/50 bg-secondary/30 py-2 pl-9 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </div>
            <div className="space-y-3">
              {feedback.map((item) => (
                <div key={item.id} className="rounded-xl border border-border/30 bg-secondary/20 p-4">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-muted-foreground">{item.anonymous ? "ไม่ระบุชื่อ" : item.studentName}</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">พึงพอใจ: {item.satisfaction}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">แนะนำ: {item.recommend}</span>
                    </div>
                  </div>
                  <p className="text-sm">{item.comment || "ไม่มีความคิดเห็นเพิ่มเติม"}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </DashboardLayoutAuth>
  );
};

export default AdminDashboardReal;
