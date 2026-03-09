import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Star, ThumbsUp, MessageSquare, Plus, QrCode, X, Download, ChevronDown, ChevronUp, PlusCircle, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { mockClasses, mockFeedback, ClassQuestion } from "@/lib/mockData";
import { getSession } from "@/lib/session";

const TeacherClasses = () => {
  const session = getSession();
  const teacherName = session?.teacherName;
  const myClasses = teacherName ? mockClasses.filter((c) => c.teacherName === teacherName) : [];
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, "feedback" | "questions">>({});
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [classQuestions, setClassQuestions] = useState<Record<string, ClassQuestion[]>>(
    Object.fromEntries(myClasses.map((c) => [c.id, [...c.customQuestions]]))
  );
  const [newQuestion, setNewQuestion] = useState<Record<string, string>>({});

  const getTab = (classId: string) => activeTab[classId] || "feedback";

  const addQuestion = (classId: string) => {
    const q = newQuestion[classId]?.trim();
    if (!q) return;
    setClassQuestions((prev) => ({
      ...prev,
      [classId]: [...(prev[classId] || []), { id: `q-${Date.now()}`, question: q }],
    }));
    setNewQuestion((prev) => ({ ...prev, [classId]: "" }));
  };

  const removeQuestion = (classId: string, qId: string) => {
    setClassQuestions((prev) => ({
      ...prev,
      [classId]: (prev[classId] || []).filter((q) => q.id !== qId),
    }));
  };

  return (
    <DashboardLayout role="teacher">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">คลาสทั้งหมด</h1>
          <p className="text-sm text-muted-foreground">จัดการคลาส ดูเรทติ้ง และความคิดเห็น</p>
        </div>
      </div>

      <div className="space-y-4">
        {myClasses.map((cls, i) => {
          const classFeedback = mockFeedback.filter((f) => f.classId === cls.id);
          const isExpanded = expandedClass === cls.id;
          const tab = getTab(cls.id);
          const questions = classQuestions[cls.id] || [];

          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                className="w-full p-6 flex flex-col items-start gap-4 hover:bg-secondary/10 transition-colors lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm">คลาส #{cls.classNumber} — {cls.courseName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cls.date} · {cls.responseCount} คำตอบ</p>
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-4 lg:w-auto lg:flex-nowrap lg:gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-accent" />
                      <span className="text-sm font-bold text-accent">{cls.avgSatisfaction}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">ความพึงพอใจ</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-bold">{cls.avgRecommend}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">แนะนำ</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedQR(cls.id); }}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-border/30">
                      {/* Tabs */}
                      <div className="mt-4 mb-4 flex w-full flex-wrap gap-1 rounded-xl bg-secondary/30 p-1 sm:w-fit">
                        {([["feedback", "ความคิดเห็น", MessageSquare], ["questions", "คำถามเพิ่มเติม", PlusCircle]] as const).map(([key, label, Icon]) => (
                          <button
                            key={key}
                            onClick={() => setActiveTab((prev) => ({ ...prev, [cls.id]: key as "feedback" | "questions" }))}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                              tab === key ? "bg-accent/10 text-accent border border-accent/20" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" /> {label}
                          </button>
                        ))}
                      </div>

                      {tab === "feedback" && (
                        <div className="space-y-3">
                          {classFeedback.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">ยังไม่มีความคิดเห็น</p>
                          ) : (
                            classFeedback.map((fb) => (
                              <div key={fb.id} className="p-4 rounded-xl bg-secondary/20 border border-border/30">
                                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <span className="text-xs text-muted-foreground">{fb.anonymous ? "ไม่ระบุชื่อ" : fb.studentName}</span>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">ความพึงพอใจ {fb.satisfaction}/10</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">แนะนำ {fb.recommend}/10</span>
                                  </div>
                                </div>
                                <p className="text-sm">{fb.comment}</p>
                                <p className="text-[10px] text-muted-foreground mt-2">{new Date(fb.createdAt).toLocaleString("th-TH")}</p>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {tab === "questions" && (
                        <div className="space-y-4">
                          {questions.length === 0 && (
                            <p className="text-sm text-muted-foreground py-2">ยังไม่มีคำถามเพิ่มเติม</p>
                          )}
                          {questions.map((q, qi) => (
                            <motion.div
                              key={q.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-accent w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">{qi + 1}</span>
                                <span className="text-sm">{q.question}</span>
                              </div>
                              <button onClick={() => removeQuestion(cls.id, q.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.div>
                          ))}
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                              value={newQuestion[cls.id] || ""}
                              onChange={(e) => setNewQuestion((prev) => ({ ...prev, [cls.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && addQuestion(cls.id)}
                              placeholder="พิมพ์คำถามใหม่..."
                              className="flex-1 bg-secondary/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                            />
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => addQuestion(cls.id)}
                              className="accent-gradient text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-accent/20"
                            >
                              <Plus className="w-4 h-4" /> เพิ่ม
                            </motion.button>
                          </div>
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
    </DashboardLayout>
  );
};

export default TeacherClasses;
