import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Star, BookOpen, Mail, Award } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { mockTeachers, mockClasses } from "@/lib/mockData";

const AdminTeachers = () => {
  const [search, setSearch] = useState("");
  const filtered = mockTeachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );
  const avgAllScore = (mockTeachers.reduce((a, t) => a + t.avgScore, 0) / mockTeachers.length).toFixed(1);
  const totalClasses = mockTeachers.reduce((a, t) => a + t.classCount, 0);

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">จัดการอาจารย์</h1>
        <p className="text-sm text-muted-foreground">รายชื่ออาจารย์ทั้งหมดในสถาบัน</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="อาจารย์ทั้งหมด" value={mockTeachers.length} delay={0} />
        <StatCard icon={BookOpen} label="คลาสทั้งหมด" value={totalClasses} delay={0.05} />
        <StatCard icon={Star} label="คะแนนเฉลี่ย" value={avgAllScore} sub="จาก 10" delay={0.1} />
        <StatCard icon={Award} label="อาจารย์ยอดเยี่ยม" value={[...mockTeachers].sort((a, b) => b.avgScore - a.avgScore)[0]?.name.split(" ")[0] || "-"} delay={0.15} />
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาอาจารย์..."
          className="w-full bg-secondary/30 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
        />
      </div>

      {/* Teacher Cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filtered.map((teacher, i) => {
          const teacherClasses = mockClasses.filter((c) => c.teacherName === teacher.name);
          return (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card-hover p-6"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-accent font-bold text-lg">{teacher.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{teacher.name}</h3>
                    <p className="text-xs text-muted-foreground">{teacher.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10">
                  <Star className="w-3.5 h-3.5 text-accent" />
                  <span className="text-sm font-bold text-accent">{teacher.avgScore}</span>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-2 break-all text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" /> {teacher.email}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-secondary/20 border border-border/30 text-center">
                  <p className="text-lg font-bold">{teacher.classCount}</p>
                  <p className="text-[10px] text-muted-foreground">คลาสทั้งหมด</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/20 border border-border/30 text-center">
                  <p className="text-lg font-bold">{teacherClasses.reduce((a, c) => a + c.responseCount, 0)}</p>
                  <p className="text-[10px] text-muted-foreground">คำตอบทั้งหมด</p>
                </div>
              </div>

              {teacherClasses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-xs font-medium text-muted-foreground mb-2">คลาสล่าสุด</p>
                  <div className="space-y-1.5">
                    {teacherClasses.slice(0, 2).map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between text-xs">
                        <span>#{cls.classNumber} {cls.courseName}</span>
                        <span className="text-accent font-medium">{cls.avgSatisfaction}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default AdminTeachers;
