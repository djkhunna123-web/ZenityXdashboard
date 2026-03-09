import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Star, ThumbsUp, MessageSquare, Search, ChevronDown, ChevronUp, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { mockClasses, mockFeedback } from "@/lib/mockData";

const AdminClasses = () => {
  const [search, setSearch] = useState("");
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "satisfaction" | "responses">("date");

  const totalResponses = mockClasses.reduce((a, c) => a + c.responseCount, 0);
  const avgSat = (mockClasses.reduce((a, c) => a + c.avgSatisfaction, 0) / mockClasses.length).toFixed(1);
  const avgRec = (mockClasses.reduce((a, c) => a + c.avgRecommend, 0) / mockClasses.length).toFixed(1);

  const filtered = mockClasses
    .filter((c) =>
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.classNumber.includes(search) ||
      c.teacherName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "satisfaction") return b.avgSatisfaction - a.avgSatisfaction;
      if (sortBy === "responses") return b.responseCount - a.responseCount;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">คลาสทั้งหมด</h1>
        <p className="text-sm text-muted-foreground">ดูความพึงพอใจและรายละเอียดของแต่ละคลาส</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="คลาสทั้งหมด" value={mockClasses.length} delay={0} />
        <StatCard icon={MessageSquare} label="คำตอบทั้งหมด" value={totalResponses} delay={0.05} />
        <StatCard icon={Star} label="ความพึงพอใจเฉลี่ย" value={avgSat} sub="จาก 10" delay={0.1} />
        <StatCard icon={ThumbsUp} label="คะแนนแนะนำเฉลี่ย" value={avgRec} sub="จาก 10" delay={0.15} />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาคลาส, วิชา, อาจารย์..."
            className="w-full bg-secondary/30 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-1 p-1 bg-secondary/30 rounded-xl">
          {([["date", "วันที่"], ["satisfaction", "ความพึงพอใจ"], ["responses", "คำตอบ"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === key ? "bg-accent/10 text-accent border border-accent/20" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Classes */}
      <div className="space-y-3">
        {filtered.map((cls, i) => {
          const classFeedback = mockFeedback.filter((f) => f.classId === cls.id);
          const isExpanded = expandedClass === cls.id;

          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                className="w-full p-5 flex flex-col items-start gap-4 hover:bg-secondary/10 transition-colors lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm">#{cls.classNumber} — {cls.courseName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cls.teacherName} · {cls.date}</p>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-center lg:gap-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-bold text-accent">{cls.avgSatisfaction}</p>
                      <p className="text-[10px] text-muted-foreground">พึงพอใจ</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">{cls.avgRecommend}</p>
                      <p className="text-[10px] text-muted-foreground">แนะนำ</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">{cls.responseCount}</p>
                      <p className="text-[10px] text-muted-foreground">คำตอบ</p>
                    </div>
                  </div>
                  {/* Satisfaction bar */}
                  <div className="w-full max-w-48 h-2 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cls.avgSatisfaction / 10) * 100}%` }}
                      transition={{ delay: i * 0.03 + 0.3, duration: 0.5 }}
                      className="h-full rounded-full accent-gradient"
                    />
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-border/30 pt-4">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">ความคิดเห็นจากนักเรียน ({classFeedback.length})</h4>
                      {classFeedback.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-3 text-center">ยังไม่มีความคิดเห็น</p>
                      ) : (
                        <div className="space-y-2">
                          {classFeedback.map((fb) => (
                            <div key={fb.id} className="p-3 rounded-xl bg-secondary/20 border border-border/30">
                              <div className="mb-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-xs text-muted-foreground">{fb.anonymous ? "ไม่ระบุชื่อ" : fb.studentName}</span>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{fb.satisfaction}/10</span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">แนะนำ {fb.recommend}/10</span>
                                </div>
                              </div>
                              <p className="text-sm">{fb.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default AdminClasses;
