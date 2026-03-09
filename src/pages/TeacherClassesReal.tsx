import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Download, MessageSquare, Plus, PlusCircle, QrCode, Star, ThumbsUp, Trash2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { DashboardLayoutAuth } from "@/components/DashboardLayoutAuth";
import { useAuth } from "@/contexts/AuthContext";
import { addClassQuestion, fetchTeacherClasses, formatDisplayDate, removeClassQuestion } from "@/lib/supabase-data";

const TeacherClassesReal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, "feedback" | "questions">>({});
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Record<string, string>>({});

  const { data: myClasses = [], isLoading } = useQuery({
    queryKey: ["teacher-classes", user?.id],
    queryFn: () => fetchTeacherClasses(user!.id),
    enabled: Boolean(user?.id),
  });

  const addQuestionMutation = useMutation({
    mutationFn: ({ classId, question }: { classId: string; question: string }) => addClassQuestion(classId, question),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-classes", user?.id] });
      await queryClient.invalidateQueries({ queryKey: ["all-classes"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "ไม่สามารถเพิ่มคำถามได้";
      toast.error(message);
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: removeClassQuestion,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teacher-classes", user?.id] });
      await queryClient.invalidateQueries({ queryKey: ["all-classes"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "ไม่สามารถลบคำถามได้";
      toast.error(message);
    },
  });

  const getTab = (classId: string) => activeTab[classId] || "feedback";

  const handleAddQuestion = async (classId: string) => {
    const question = newQuestion[classId]?.trim();
    if (!question) return;
    await addQuestionMutation.mutateAsync({ classId, question });
    setNewQuestion((current) => ({ ...current, [classId]: "" }));
    toast.success("เพิ่มคำถามเพิ่มเติมเรียบร้อยแล้ว");
  };

  return (
    <DashboardLayoutAuth role="teacher">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">คลาสของฉัน</h1>
          <p className="text-sm text-muted-foreground">ดูผลประเมินของแต่ละคลาส จัดการคำถามเพิ่มเติม และแชร์ลิงก์แบบประเมิน</p>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 text-center text-sm text-muted-foreground">กำลังโหลดรายการคลาส...</div>
      ) : (
        <div className="space-y-4">
          {myClasses.map((item, index) => {
            const isExpanded = expandedClass === item.id;
            const tab = getTab(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedClass(isExpanded ? null : item.id)}
                  className="flex w-full flex-col items-start gap-4 p-6 transition-colors hover:bg-secondary/10 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                      <BookOpen className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold">คลาส #{item.classNumber} - {item.courseName}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatDisplayDate(item.date)} • {item.responseCount} คำตอบ</p>
                    </div>
                  </div>
                  <div className="flex w-full flex-wrap items-center gap-4 lg:w-auto lg:flex-nowrap lg:gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-accent" />
                        <span className="text-sm font-bold text-accent">{item.avgSatisfaction.toFixed(1)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">ความพึงพอใจ</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold">{item.avgRecommend.toFixed(1)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">การแนะนำ</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQR(item.id);
                      }}
                      className="text-muted-foreground transition-colors hover:text-accent"
                    >
                      <QrCode className="h-5 w-5" />
                    </button>
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
                      <div className="border-t border-border/30 px-6 pb-6">
                        <div className="mb-4 mt-4 flex w-full flex-wrap gap-1 rounded-xl bg-secondary/30 p-1 sm:w-fit">
                          {([
                            ["feedback", "ความคิดเห็น", MessageSquare],
                            ["questions", "คำถามเพิ่มเติม", PlusCircle],
                          ] as const).map(([key, label, Icon]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setActiveTab((current) => ({ ...current, [item.id]: key }))}
                              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                                tab === key ? "border border-accent/20 bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" /> {label}
                            </button>
                          ))}
                        </div>

                        {tab === "feedback" && (
                          <div className="space-y-3">
                            {item.feedback.length === 0 ? (
                              <p className="py-4 text-center text-sm text-muted-foreground">ยังไม่มีความคิดเห็นสำหรับคลาสนี้</p>
                            ) : (
                              item.feedback.map((feedback) => (
                                <div key={feedback.id} className="rounded-xl border border-border/30 bg-secondary/20 p-4">
                                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-xs text-muted-foreground">{feedback.anonymous ? "ไม่ระบุชื่อ" : feedback.studentName}</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">พึงพอใจ {feedback.satisfaction}/10</span>
                                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">แนะนำ {feedback.recommend}/10</span>
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
                                  <p className="mt-2 text-[10px] text-muted-foreground">{new Date(feedback.createdAt).toLocaleString("th-TH")}</p>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                        {tab === "questions" && (
                          <div className="space-y-4">
                            {item.customQuestions.length === 0 && (
                              <p className="py-2 text-sm text-muted-foreground">ยังไม่มีคำถามเพิ่มเติมสำหรับคลาสนี้</p>
                            )}
                            {item.customQuestions.map((question, questionIndex) => (
                              <motion.div
                                key={question.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between rounded-xl border border-border/30 bg-secondary/20 p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">{questionIndex + 1}</span>
                                  <span className="text-sm">{question.question}</span>
                                </div>
                                <button type="button" onClick={() => deleteQuestionMutation.mutate(question.id)} className="text-muted-foreground transition-colors hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </motion.div>
                            ))}
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <input
                                value={newQuestion[item.id] || ""}
                                onChange={(e) => setNewQuestion((current) => ({ ...current, [item.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === "Enter" && void handleAddQuestion(item.id)}
                                placeholder="พิมพ์คำถามเพิ่มเติม..."
                                className="flex-1 rounded-xl border border-border/50 bg-secondary/30 px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/30"
                              />
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => void handleAddQuestion(item.id)}
                                className="accent-gradient flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20"
                              >
                                <Plus className="h-4 w-4" /> เพิ่ม
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
              <h3 className="mb-2 text-lg font-bold">QR Code</h3>
              <p className="mb-6 text-sm text-muted-foreground">ให้นักเรียนสแกนหรือเปิดลิงก์นี้เพื่อส่งแบบประเมินของคลาส</p>
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
                <Download className="h-4 w-4" /> เปิดลิงก์
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayoutAuth>
  );
};

export default TeacherClassesReal;
