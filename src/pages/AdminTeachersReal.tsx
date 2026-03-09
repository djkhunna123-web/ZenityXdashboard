import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award, BookOpen, Check, Mail, Search, Star, Users, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayoutAuth } from "@/components/DashboardLayoutAuth";
import { StatCard } from "@/components/StatCard";
import { buildTeacherSummaries, fetchAllClasses, fetchTeachers, updateTeacherStatus } from "@/lib/supabase-data";

const AdminTeachersReal = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["all-classes"],
    queryFn: fetchAllClasses,
  });
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ teacherId, status }: { teacherId: string; status: "approved" | "rejected" }) => updateTeacherStatus(teacherId, status),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(variables.status === "approved" ? "อนุมัติอาจารย์เรียบร้อยแล้ว" : "ปฏิเสธอาจารย์เรียบร้อยแล้ว");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "ไม่สามารถอัปเดตสถานะอาจารย์ได้";
      toast.error(message);
    },
  });

  const summaries = useMemo(() => buildTeacherSummaries(teachers, classes), [teachers, classes]);
  const filtered = summaries.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) || teacher.email.toLowerCase().includes(search.toLowerCase())
  );

  const approvedTeachers = summaries.filter((teacher) => teacher.status === "approved");
  const pendingTeachers = summaries.filter((teacher) => teacher.status === "pending");
  const avgAllScore = approvedTeachers.length
    ? (approvedTeachers.reduce((total, item) => total + item.avgScore, 0) / approvedTeachers.length).toFixed(1)
    : "0.0";
  const totalClasses = approvedTeachers.reduce((total, item) => total + item.classCount, 0);

  return (
    <DashboardLayoutAuth role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">จัดการอาจารย์</h1>
        <p className="text-sm text-muted-foreground">ตรวจสอบรายชื่ออาจารย์ อนุมัติการเข้าใช้งาน และติดตามผลการสอน</p>
      </div>

      {classesLoading || teachersLoading ? (
        <div className="glass-card p-8 text-center text-sm text-muted-foreground">กำลังโหลดข้อมูลอาจารย์...</div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Users} label="อาจารย์ทั้งหมด" value={summaries.length} delay={0} />
            <StatCard icon={Award} label="รออนุมัติ" value={pendingTeachers.length} delay={0.05} />
            <StatCard icon={BookOpen} label="จำนวนคลาสของอาจารย์ที่อนุมัติแล้ว" value={totalClasses} delay={0.1} />
            <StatCard icon={Star} label="คะแนนเฉลี่ยของอาจารย์ที่อนุมัติแล้ว" value={avgAllScore} sub="จาก 10" delay={0.15} />
          </div>

          <div className="relative mb-6 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อหรืออีเมลอาจารย์..."
              className="w-full rounded-xl border border-border/50 bg-secondary/30 py-2.5 pl-9 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filtered.map((teacher, index) => {
              const teacherClasses = classes.filter((item) => item.teacherId === teacher.id);
              const isPending = teacher.status === "pending";
              const isRejected = teacher.status === "rejected";

              return (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card-hover p-6"
                >
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                        <span className="text-lg font-bold text-accent">{teacher.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">{teacher.name}</h3>
                        <p className="text-xs text-muted-foreground">{teacher.department}</p>
                      </div>
                    </div>
                    <div
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        isPending
                          ? "bg-amber-500/10 text-amber-300"
                          : isRejected
                            ? "bg-destructive/10 text-destructive"
                            : "bg-accent/10 text-accent"
                      }`}
                    >
                      {isPending ? "รออนุมัติ" : isRejected ? "ไม่อนุมัติ" : "อนุมัติแล้ว"}
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-2 break-all text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> {teacher.email}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/30 bg-secondary/20 p-3 text-center">
                      <p className="text-lg font-bold">{teacher.classCount}</p>
                      <p className="text-[10px] text-muted-foreground">จำนวนคลาส</p>
                    </div>
                    <div className="rounded-xl border border-border/30 bg-secondary/20 p-3 text-center">
                      <p className="text-lg font-bold">{teacher.totalResponses}</p>
                      <p className="text-[10px] text-muted-foreground">จำนวนคำตอบ</p>
                    </div>
                  </div>

                  {teacher.status !== "approved" && (
                    <div className="mt-4 flex gap-3 border-t border-border/30 pt-4">
                      <button
                        type="button"
                        onClick={() => updateStatusMutation.mutate({ teacherId: teacher.id, status: "approved" })}
                        disabled={updateStatusMutation.isPending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" /> อนุมัติ
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatusMutation.mutate({ teacherId: teacher.id, status: "rejected" })}
                        disabled={updateStatusMutation.isPending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-50"
                      >
                        <X className="h-4 w-4" /> ปฏิเสธ
                      </button>
                    </div>
                  )}

                  {teacher.status === "approved" && teacherClasses.length > 0 && (
                    <div className="mt-4 border-t border-border/30 pt-4">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">คลาสล่าสุด</p>
                      <div className="space-y-1.5">
                        {teacherClasses.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <span>#{item.classNumber} {item.courseName}</span>
                            <span className="font-medium text-accent">{item.avgSatisfaction.toFixed(1)}/10</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </DashboardLayoutAuth>
  );
};

export default AdminTeachersReal;
