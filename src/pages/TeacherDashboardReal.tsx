import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Download, MessageSquare, Plus, QrCode, Star, ThumbsUp, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { DashboardLayoutAuth } from "@/components/DashboardLayoutAuth";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { buildChartData, createClass, fetchTeacherClasses, formatDisplayDate } from "@/lib/supabase-data";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const t = {
  classCreated: "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e25\u0e32\u0e2a\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22\u0e41\u0e25\u0e49\u0e27",
  classCreateFailed: "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e25\u0e32\u0e2a\u0e44\u0e21\u0e48\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08",
  fillClassInfo: "\u0e01\u0e23\u0e38\u0e13\u0e32\u0e01\u0e23\u0e2d\u0e01\u0e40\u0e25\u0e02\u0e04\u0e25\u0e32\u0e2a\u0e41\u0e25\u0e30\u0e0a\u0e37\u0e48\u0e2d\u0e27\u0e34\u0e0a\u0e32",
  dashboard: "\u0e41\u0e14\u0e0a\u0e1a\u0e2d\u0e23\u0e4c\u0e14",
  welcome: "\u0e22\u0e34\u0e19\u0e14\u0e35\u0e15\u0e49\u0e2d\u0e19\u0e23\u0e31\u0e1a",
  teacher: "\u0e2d\u0e32\u0e08\u0e32\u0e23\u0e22\u0e4c",
  createNewClass: "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e25\u0e32\u0e2a\u0e43\u0e2b\u0e21\u0e48",
  loadingClasses: "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e42\u0e2b\u0e25\u0e14\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e04\u0e25\u0e32\u0e2a...",
  classCount: "\u0e08\u0e33\u0e19\u0e27\u0e19\u0e04\u0e25\u0e32\u0e2a",
  responseCount: "\u0e08\u0e33\u0e19\u0e27\u0e19\u0e04\u0e33\u0e15\u0e2d\u0e1a",
  avgSatisfaction: "\u0e04\u0e30\u0e41\u0e19\u0e19\u0e04\u0e27\u0e32\u0e21\u0e1e\u0e36\u0e07\u0e1e\u0e2d\u0e43\u0e08\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22",
  avgRecommend: "\u0e04\u0e30\u0e41\u0e19\u0e19\u0e41\u0e19\u0e30\u0e19\u0e33\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22",
  outOf10: "\u0e08\u0e32\u0e01 10",
  satisfactionTrend: "\u0e41\u0e19\u0e27\u0e42\u0e19\u0e49\u0e21\u0e04\u0e27\u0e32\u0e21\u0e1e\u0e36\u0e07\u0e1e\u0e2d\u0e43\u0e08",
  responsesPerClass: "\u0e08\u0e33\u0e19\u0e27\u0e19\u0e04\u0e33\u0e15\u0e2d\u0e1a\u0e15\u0e48\u0e2d\u0e04\u0e25\u0e32\u0e2a",
  myClasses: "\u0e04\u0e25\u0e32\u0e2a\u0e02\u0e2d\u0e07\u0e09\u0e31\u0e19",
  classLabel: "\u0e04\u0e25\u0e32\u0e2a",
  course: "\u0e27\u0e34\u0e0a\u0e32",
  date: "\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48",
  responses: "\u0e04\u0e33\u0e15\u0e2d\u0e1a",
  satisfaction: "\u0e04\u0e27\u0e32\u0e21\u0e1e\u0e36\u0e07\u0e1e\u0e2d\u0e43\u0e08",
  latestFeedback: "\u0e04\u0e27\u0e32\u0e21\u0e04\u0e34\u0e14\u0e40\u0e2b\u0e47\u0e19\u0e25\u0e48\u0e32\u0e2a\u0e38\u0e14",
  noFeedback: "\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e04\u0e27\u0e32\u0e21\u0e04\u0e34\u0e14\u0e40\u0e2b\u0e47\u0e19\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e1a\u0e31\u0e0d\u0e0a\u0e35\u0e19\u0e35\u0e49",
  anonymous: "\u0e44\u0e21\u0e48\u0e23\u0e30\u0e1a\u0e38\u0e0a\u0e37\u0e48\u0e2d",
  noExtraComment: "\u0e44\u0e21\u0e48\u0e21\u0e35\u0e04\u0e27\u0e32\u0e21\u0e04\u0e34\u0e14\u0e40\u0e2b\u0e47\u0e19\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e40\u0e15\u0e34\u0e21",
  qrTitle: "QR Code",
  qrDescription: "\u0e43\u0e2b\u0e49\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19\u0e2a\u0e41\u0e01\u0e19\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e2a\u0e48\u0e07\u0e41\u0e1a\u0e1a\u0e1b\u0e23\u0e30\u0e40\u0e21\u0e34\u0e19\u0e02\u0e2d\u0e07\u0e04\u0e25\u0e32\u0e2a\u0e19\u0e35\u0e49",
  openLink: "\u0e40\u0e1b\u0e34\u0e14\u0e25\u0e34\u0e07\u0e01\u0e4c",
  newClassTitle: "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e25\u0e32\u0e2a\u0e43\u0e2b\u0e21\u0e48",
  classNumber: "\u0e40\u0e25\u0e02\u0e04\u0e25\u0e32\u0e2a",
  courseName: "\u0e0a\u0e37\u0e48\u0e2d\u0e27\u0e34\u0e0a\u0e32",
  teachingDate: "\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e2a\u0e2d\u0e19",
  exampleClass: "\u0e40\u0e0a\u0e48\u0e19 108",
  cancel: "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01",
  creating: "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07...",
  createClass: "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e25\u0e32\u0e2a",
};

const TeacherDashboardReal = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [newClass, setNewClass] = useState({
    classNumber: "",
    courseName: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const { data: myClasses = [], isLoading } = useQuery({
    queryKey: ["teacher-classes", user?.id],
    queryFn: () => fetchTeacherClasses(user!.id),
    enabled: Boolean(user?.id),
  });

  const createClassMutation = useMutation({
    mutationFn: createClass,
    onSuccess: async () => {
      toast.success(t.classCreated);
      setShowCreate(false);
      setNewClass({
        classNumber: "",
        courseName: "",
        date: new Date().toISOString().slice(0, 10),
      });
      await queryClient.invalidateQueries({ queryKey: ["teacher-classes", user?.id] });
      await queryClient.invalidateQueries({ queryKey: ["all-classes"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : t.classCreateFailed;
      toast.error(message);
    },
  });

  const recentFeedback = useMemo(
    () =>
      myClasses
        .flatMap((item) => item.feedback)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [myClasses]
  );

  const totalResponses = myClasses.reduce((total, item) => total + item.responseCount, 0);
  const avgSat = myClasses.length
    ? (myClasses.reduce((total, item) => total + item.avgSatisfaction, 0) / myClasses.length).toFixed(1)
    : "0.0";
  const avgRec = myClasses.length
    ? (myClasses.reduce((total, item) => total + item.avgRecommend, 0) / myClasses.length).toFixed(1)
    : "0.0";
  const chartData = buildChartData(myClasses);

  const handleCreateClass = async () => {
    if (!user || !profile) return;

    if (!newClass.classNumber.trim() || !newClass.courseName.trim()) {
      toast.error(t.fillClassInfo);
      return;
    }

    await createClassMutation.mutateAsync({
      teacherId: user.id,
      teacherName: profile.full_name,
      classNumber: newClass.classNumber.trim(),
      courseName: newClass.courseName.trim(),
      date: newClass.date,
    });
  };

  return (
    <DashboardLayoutAuth role="teacher">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.dashboard}</h1>
          <p className="text-sm text-muted-foreground">{t.welcome}, {profile?.full_name ?? user?.email ?? t.teacher}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreate(true)}
          className="accent-gradient flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20"
        >
          <Plus className="h-4 w-4" /> {t.createNewClass}
        </motion.button>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 text-center text-sm text-muted-foreground">{t.loadingClasses}</div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={BookOpen} label={t.classCount} value={myClasses.length} delay={0} />
            <StatCard icon={MessageSquare} label={t.responseCount} value={totalResponses} delay={0.05} />
            <StatCard icon={Star} label={t.avgSatisfaction} value={avgSat} sub={t.outOf10} delay={0.1} />
            <StatCard icon={ThumbsUp} label={t.avgRecommend} value={avgRec} sub={t.outOf10} delay={0.15} />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h3 className="mb-4 text-sm font-semibold">{t.satisfactionTrend}</h3>
              <ResponsiveContainer width="100%" height={200}>
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
              <h3 className="mb-4 text-sm font-semibold">{t.responsesPerClass}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={myClasses.map((item) => ({ name: `#${item.classNumber}`, responses: item.responseCount }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="responses" fill="hsl(0 85% 58%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
            <div className="border-b border-border/50 p-6">
              <h3 className="text-sm font-semibold">{t.myClasses}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-border/30 text-xs text-muted-foreground">
                    <th className="px-6 py-3 text-left font-medium">{t.classLabel}</th>
                    <th className="px-6 py-3 text-left font-medium">{t.course}</th>
                    <th className="px-6 py-3 text-left font-medium">{t.date}</th>
                    <th className="px-6 py-3 text-center font-medium">{t.responses}</th>
                    <th className="px-6 py-3 text-center font-medium">{t.satisfaction}</th>
                    <th className="px-6 py-3 text-center font-medium">QR Code</th>
                  </tr>
                </thead>
                <tbody>
                  {myClasses.map((item) => (
                    <tr key={item.id} className="border-b border-border/20 transition-colors hover:bg-secondary/20">
                      <td className="px-6 py-4 text-sm font-semibold">#{item.classNumber}</td>
                      <td className="px-6 py-4 text-sm">{item.courseName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{formatDisplayDate(item.date)}</td>
                      <td className="px-6 py-4 text-center text-sm">{item.responseCount}</td>
                      <td className="px-6 py-4 text-center text-sm font-semibold text-accent">{item.avgSatisfaction.toFixed(1)}</td>
                      <td className="px-6 py-4 text-center">
                        <button type="button" onClick={() => setSelectedQR(item.id)} className="text-muted-foreground transition-colors hover:text-accent">
                          <QrCode className="mx-auto h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card mt-6 p-6">
            <h3 className="mb-4 text-sm font-semibold">{t.latestFeedback}</h3>
            <div className="space-y-3">
              {recentFeedback.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">{t.noFeedback}</p>
              ) : (
                recentFeedback.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border/30 bg-secondary/20 p-4">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs text-muted-foreground">{item.anonymous ? t.anonymous : item.studentName}</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{item.satisfaction}/10</span>
                      </div>
                    </div>
                    <p className="text-sm">{item.comment || t.noExtraComment}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}

      <AnimatePresence>
        {selectedQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedQR(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card relative mx-4 w-full max-w-sm p-6 text-center sm:p-8"
            >
              <button type="button" onClick={() => setSelectedQR(null)} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
              <h3 className="mb-2 text-lg font-bold">{t.qrTitle}</h3>
              <p className="mb-6 text-sm text-muted-foreground">{t.qrDescription}</p>
              <div className="mb-6 inline-block rounded-2xl bg-background p-4">
                <QRCodeSVG value={`${window.location.origin}/feedback/${selectedQR}`} size={200} bgColor="transparent" fgColor="currentColor" className="text-foreground" />
              </div>
              <p className="mb-4 break-all text-xs text-muted-foreground">{window.location.origin}/feedback/{selectedQR}</p>
              <a
                href={`${window.location.origin}/feedback/${selectedQR}`}
                target="_blank"
                rel="noreferrer"
                className="accent-gradient mx-auto inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20"
              >
                <Download className="h-4 w-4" /> {t.openLink}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card mx-4 w-full max-w-md p-6 sm:p-8"
            >
              <h3 className="mb-6 text-lg font-bold">{t.newClassTitle}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.classNumber}</label>
                  <input
                    value={newClass.classNumber}
                    onChange={(e) => setNewClass((current) => ({ ...current, classNumber: e.target.value }))}
                    placeholder={t.exampleClass}
                    className="mt-2 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.courseName}</label>
                  <input
                    value={newClass.courseName}
                    onChange={(e) => setNewClass((current) => ({ ...current, courseName: e.target.value }))}
                    placeholder="เช่น Advanced Neural Networks"
                    className="mt-2 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.teachingDate}</label>
                  <input
                    type="date"
                    value={newClass.date}
                    onChange={(e) => setNewClass((current) => ({ ...current, date: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-xl border border-border bg-secondary/30 py-3 text-sm font-medium transition-all hover:bg-secondary/50">
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateClass}
                    disabled={createClassMutation.isPending}
                    className="accent-gradient flex-1 rounded-xl py-3 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 disabled:opacity-50"
                  >
                    {createClassMutation.isPending ? t.creating : t.createClass}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayoutAuth>
  );
};

export default TeacherDashboardReal;
