import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Calendar, CheckCircle2, Hash, User } from "lucide-react";
import { toast } from "sonner";
import { SatisfactionRating } from "@/components/SatisfactionRating";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ZenityXLogo } from "@/components/ZenityXLogo";
import { fetchPublicClass, formatDisplayDate, submitFeedback } from "@/lib/supabase-data";

const FeedbackPageReal = () => {
  const { classId = "" } = useParams();
  const { data: classData, isLoading } = useQuery({
    queryKey: ["public-class", classId],
    queryFn: () => fetchPublicClass(classId),
    enabled: Boolean(classId),
  });

  const [satisfaction, setSatisfaction] = useState(0);
  const [recommend, setRecommend] = useState(0);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const feedbackMutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      setSubmitted(true);
      toast.success("ส่งแบบประเมินเรียบร้อยแล้ว");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "ไม่สามารถส่งแบบประเมินได้";
      toast.error(message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classData || satisfaction === 0 || recommend === 0) {
      return;
    }

    if (!anonymous && !studentName.trim()) {
      toast.error("กรุณากรอกชื่อของคุณ หรือเลือกส่งแบบไม่ระบุชื่อ");
      return;
    }

    await feedbackMutation.mutateAsync({
      classId: classData.id,
      satisfaction,
      recommend,
      comment,
      anonymous,
      studentName: anonymous ? null : studentName.trim(),
      questionAnswers: classData.customQuestions.map((question) => ({
        questionId: question.id,
        answer: questionAnswers[question.id] ?? "",
      })),
    });
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <ZenityXLogo size="sm" />
          <ThemeToggle />
        </div>

        {isLoading ? (
          <div className="glass-card p-8 text-center text-sm text-muted-foreground">กำลังโหลดข้อมูลคลาส...</div>
        ) : !classData ? (
          <div className="glass-card p-8 text-center text-sm text-muted-foreground">ไม่พบคลาสนี้ หรือปิดรับแบบประเมินแล้ว</div>
        ) : (
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="thanks" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full accent-gradient shadow-lg shadow-accent/30"
                >
                  <CheckCircle2 className="h-10 w-10 text-accent-foreground" />
                </motion.div>
                <h2 className="mb-3 text-3xl font-bold">ขอบคุณสำหรับความคิดเห็น</h2>
                <p className="mx-auto max-w-md text-muted-foreground">
                  ระบบบันทึกคำตอบของคุณเรียบร้อยแล้ว และจะนำไปใช้พัฒนาประสบการณ์การเรียนให้ดียิ่งขึ้น
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card mb-8 p-6">
                  <h2 className="mb-4 text-lg font-bold">ข้อมูลคลาส</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      { icon: Hash, label: "คลาส", value: `#${classData.classNumber}` },
                      { icon: User, label: "อาจารย์", value: classData.teacherName },
                      { icon: BookOpen, label: "รายวิชา", value: classData.courseName },
                      { icon: Calendar, label: "วันที่สอน", value: formatDisplayDate(classData.date) },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/50">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-semibold">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
                    <SatisfactionRating value={satisfaction} onChange={setSatisfaction} label="คุณพึงพอใจกับคลาสนี้มากน้อยแค่ไหน?" />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                    <SatisfactionRating value={recommend} onChange={setRecommend} label="คุณมีแนวโน้มจะแนะนำคลาสนี้ให้ผู้อื่นมากน้อยแค่ไหน?" />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card space-y-4 p-6">
                    <label className="text-sm font-medium">ความคิดเห็นเพิ่มเติม</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="เล่าเพิ่มเติมได้เลยว่าอะไรจะช่วยให้อาจารย์พัฒนาคลาสนี้ได้ดีขึ้น"
                      rows={4}
                      className="w-full resize-none rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </motion.div>

                  {classData.customQuestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card space-y-4 p-6">
                      <label className="text-sm font-medium">คำถามเพิ่มเติม</label>
                      <div className="space-y-4">
                        {classData.customQuestions.map((question, index) => (
                          <div key={question.id} className="space-y-2">
                            <label className="text-sm">
                              {index + 1}. {question.question}
                            </label>
                            <textarea
                              value={questionAnswers[question.id] ?? ""}
                              onChange={(e) =>
                                setQuestionAnswers((current) => ({
                                  ...current,
                                  [question.id]: e.target.value,
                                }))
                              }
                              rows={3}
                              placeholder="พิมพ์คำตอบของคุณ..."
                              className="w-full resize-none rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card space-y-4 p-6">
                    <label className="text-sm font-medium">การแสดงตัวตน</label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {[
                        { val: true, label: "ส่งแบบไม่ระบุชื่อ" },
                        { val: false, label: "ระบุชื่อของฉัน" },
                      ].map((opt) => (
                        <button
                          key={String(opt.val)}
                          type="button"
                          onClick={() => setAnonymous(opt.val)}
                          className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                            anonymous === opt.val
                              ? "border-accent/30 bg-accent/10 text-accent"
                              : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-accent/20"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <AnimatePresence>
                      {!anonymous && (
                        <motion.input
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="กรอกชื่อของคุณ"
                          className="w-full rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={satisfaction === 0 || recommend === 0 || feedbackMutation.isPending}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl accent-gradient py-4 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {feedbackMutation.isPending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-5 w-5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground"
                      />
                    ) : (
                      "ส่งแบบประเมิน"
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default FeedbackPageReal;
