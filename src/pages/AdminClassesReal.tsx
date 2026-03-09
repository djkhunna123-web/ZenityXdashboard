import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, MessageSquare, Search, Star, ThumbsUp } from "lucide-react";
import { DashboardLayoutAuth } from "@/components/DashboardLayoutAuth";
import { StatCard } from "@/components/StatCard";
import { fetchAllClasses, formatDisplayDate } from "@/lib/supabase-data";

const AdminClassesReal = () => {
  const [search, setSearch] = useState("");
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "satisfaction" | "responses">("date");
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["all-classes"],
    queryFn: fetchAllClasses,
  });

  const totalResponses = classes.reduce((total, item) => total + item.responseCount, 0);
  const avgSat = classes.length ? (classes.reduce((total, item) => total + item.avgSatisfaction, 0) / classes.length).toFixed(1) : "0.0";
  const avgRec = classes.length ? (classes.reduce((total, item) => total + item.avgRecommend, 0) / classes.length).toFixed(1) : "0.0";

  const filtered = classes
    .filter((item) =>
      item.courseName.toLowerCase().includes(search.toLowerCase()) ||
      item.classNumber.includes(search) ||
      item.teacherName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "satisfaction") return b.avgSatisfaction - a.avgSatisfaction;
      if (sortBy === "responses") return b.responseCount - a.responseCount;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <DashboardLayoutAuth role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">คลาสทั้งหมด</h1>
        <p className="text-sm text-muted-foreground">ค้นหา เรียงลำดับ และเปิดดูรายละเอียดความคิดเห็นของแต่ละคลาส</p>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 text-center text-sm text-muted-foreground">กำลังโหลดข้อมูลคลาส...</div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={BookOpen} label="จำนวนคลาสทั้งหมด" value={classes.length} delay={0} />
            <StatCard icon={MessageSquare} label="จำนวนคำตอบทั้งหมด" value={totalResponses} delay={0.05} />
            <StatCard icon={Star} label="คะแนนพึงพอใจเฉลี่ย" value={avgSat} sub="จาก 10" delay={0.1} />
            <StatCard icon={ThumbsUp} label="คะแนนการแนะนำเฉลี่ย" value={avgRec} sub="จาก 10" delay={0.15} />
          </div>

          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาคลาส วิชา หรือชื่ออาจารย์..."
                className="w-full rounded-xl border border-border/50 bg-secondary/30 py-2.5 pl-9 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div className="flex flex-wrap gap-1 rounded-xl bg-secondary/30 p-1">
              {([
                ["date", "วันที่"],
                ["satisfaction", "ความพึงพอใจ"],
                ["responses", "จำนวนคำตอบ"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSortBy(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    sortBy === key ? "border border-accent/20 bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((item, index) => {
              const isExpanded = expandedClass === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="glass-card overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedClass(isExpanded ? null : item.id)}
                    className="flex w-full flex-col items-start gap-4 p-5 transition-colors hover:bg-secondary/10 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                        <BookOpen className="h-4 w-4 text-accent" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-bold">#{item.classNumber} - {item.courseName}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.teacherName} • {formatDisplayDate(item.date)}</p>
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-center lg:gap-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-bold text-accent">{item.avgSatisfaction.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">พึงพอใจ</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold">{item.avgRecommend.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">แนะนำ</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold">{item.responseCount}</p>
                          <p className="text-[10px] text-muted-foreground">คำตอบ</p>
                        </div>
                      </div>
                      <div className="h-2 w-full max-w-48 overflow-hidden rounded-full bg-secondary/50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.avgSatisfaction / 10) * 100}%` }}
                          transition={{ delay: index * 0.03 + 0.3, duration: 0.5 }}
                          className="h-full rounded-full accent-gradient"
                        />
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
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
                        <div className="border-t border-border/30 px-5 pb-5 pt-4">
                          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ความคิดเห็นของผู้เรียน ({item.feedback.length})</h4>
                          {item.feedback.length === 0 ? (
                            <p className="py-3 text-center text-sm text-muted-foreground">ยังไม่มีความคิดเห็นสำหรับคลาสนี้</p>
                          ) : (
                            <div className="space-y-2">
                              {item.feedback.map((feedback) => (
                                <div key={feedback.id} className="rounded-xl border border-border/30 bg-secondary/20 p-3">
                                  <div className="mb-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-xs text-muted-foreground">{feedback.anonymous ? "ไม่ระบุชื่อ" : feedback.studentName}</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">{feedback.satisfaction}/10</span>
                                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">แนะนำ {feedback.recommend}/10</span>
                                    </div>
                                  </div>
                                  <p className="text-sm">{feedback.comment || "ไม่มีความคิดเห็นเพิ่มเติม"}</p>
                                  {feedback.questionAnswers.length > 0 && (
                                    <div className="mt-3 space-y-2 border-t border-border/20 pt-3">
                                      {item.customQuestions
                                        .filter((question) => feedback.questionAnswers.some((answer) => answer.questionId === question.id))
                                        .map((question) => {
                                          const answer = feedback.questionAnswers.find((entry) => entry.questionId === question.id);
                                          if (!answer) return null;

                                          return (
                                            <div key={answer.id} className="text-xs">
                                              <p className="font-medium text-muted-foreground">{question.question}</p>
                                              <p className="mt-1 text-sm">{answer.answer}</p>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  )}
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
        </>
      )}
    </DashboardLayoutAuth>
  );
};

export default AdminClassesReal;
