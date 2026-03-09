import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { Database } from "@/lib/database.types";

export interface ClassQuestion {
  id: string;
  question: string;
}

export interface QuestionAnswerData {
  id: string;
  questionId: string;
  answer: string;
}

export interface FeedbackData {
  id: string;
  classId: string;
  satisfaction: number;
  recommend: number;
  comment: string;
  studentName: string | null;
  anonymous: boolean;
  createdAt: string;
  questionAnswers: QuestionAnswerData[];
}

export interface ClassData {
  id: string;
  teacherId: string;
  teacherName: string;
  classNumber: string;
  courseName: string;
  date: string;
  createdAt: string;
  responseCount: number;
  avgSatisfaction: number;
  avgRecommend: number;
  customQuestions: ClassQuestion[];
  feedback: FeedbackData[];
}

export interface TeacherSummary {
  id: string;
  name: string;
  email: string;
  department: string;
  status: ProfileRow["status"];
  classCount: number;
  totalResponses: number;
  avgScore: number;
}

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const ensureConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Please add your environment variables first.");
  }
};

const sortFeedbackNewestFirst = (feedback: FeedbackData[]) =>
  [...feedback].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const mapClassRow = (row: any): ClassData => {
  const feedback = sortFeedbackNewestFirst(
    (row.feedback ?? []).map((item: any) => ({
      id: item.id,
      classId: item.class_id,
      satisfaction: item.satisfaction,
      recommend: item.recommend,
      comment: item.comment ?? "",
      studentName: item.student_name,
      anonymous: item.anonymous,
      createdAt: item.created_at,
      questionAnswers: (item.feedback_question_answers ?? []).map((answer: any) => ({
        id: answer.id,
        questionId: answer.class_question_id,
        answer: answer.answer,
      })),
    }))
  );

  const responseCount = feedback.length;
  const avgSatisfaction = responseCount
    ? Number((feedback.reduce((total, item) => total + item.satisfaction, 0) / responseCount).toFixed(1))
    : 0;
  const avgRecommend = responseCount
    ? Number((feedback.reduce((total, item) => total + item.recommend, 0) / responseCount).toFixed(1))
    : 0;

  return {
    id: row.id,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    classNumber: row.class_number,
    courseName: row.course_name,
    date: row.class_date,
    createdAt: row.created_at,
    responseCount,
    avgSatisfaction,
    avgRecommend,
    customQuestions: (row.class_questions ?? []).map((question: any) => ({
      id: question.id,
      question: question.question,
    })),
    feedback,
  };
};

export const formatDisplayDate = (date: string) =>
  new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const buildChartData = (classes: ClassData[]) =>
  [...classes]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-6)
    .map((item) => ({
      name: `#${item.classNumber}`,
      satisfaction: item.avgSatisfaction,
      recommend: item.avgRecommend,
    }));

const classSelect = `
  id,
  teacher_id,
  teacher_name,
  class_number,
  course_name,
  class_date,
  created_at,
  class_questions (
    id,
    question,
    created_at
  ),
  feedback (
    id,
    class_id,
    satisfaction,
    recommend,
    comment,
    student_name,
    anonymous,
    created_at,
    feedback_question_answers (
      id,
      class_question_id,
      answer,
      created_at
    )
  )
`;

export const fetchTeacherClasses = async (teacherId: string) => {
  ensureConfigured();

  const { data, error } = await supabase
    .from("classes")
    .select(classSelect)
    .eq("teacher_id", teacherId)
    .order("class_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapClassRow);
};

export const fetchAllClasses = async () => {
  ensureConfigured();

  const { data, error } = await supabase
    .from("classes")
    .select(classSelect)
    .order("class_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapClassRow);
};

export const fetchPublicClass = async (classId: string) => {
  ensureConfigured();

  const { data, error } = await supabase
    .from("classes")
    .select(`
      id,
      teacher_id,
      teacher_name,
      class_number,
      course_name,
      class_date,
      created_at,
      class_questions (
        id,
        question,
        created_at
      )
    `)
    .eq("id", classId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    teacherId: data.teacher_id,
    teacherName: data.teacher_name,
    classNumber: data.class_number,
    courseName: data.course_name,
    date: data.class_date,
    createdAt: data.created_at,
    responseCount: 0,
    avgSatisfaction: 0,
    avgRecommend: 0,
    customQuestions: (data.class_questions ?? []).map((question: any) => ({
      id: question.id,
      question: question.question,
    })),
    feedback: [],
  } satisfies ClassData;
};

export const fetchTeachers = async () => {
  ensureConfigured();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "teacher")
    .order("full_name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ProfileRow[];
};

export const updateTeacherStatus = async (teacherId: string, status: ProfileRow["status"]) => {
  ensureConfigured();

  const { error } = await supabase.from("profiles").update({ status }).eq("id", teacherId).eq("role", "teacher");
  if (error) throw error;
};

export const createClass = async (input: {
  teacherId: string;
  teacherName: string;
  classNumber: string;
  courseName: string;
  date: string;
}) => {
  ensureConfigured();

  const { error } = await supabase.from("classes").insert({
    teacher_id: input.teacherId,
    teacher_name: input.teacherName,
    class_number: input.classNumber,
    course_name: input.courseName,
    class_date: input.date,
  });

  if (error) throw error;
};

export const addClassQuestion = async (classId: string, question: string) => {
  ensureConfigured();

  const { error } = await supabase.from("class_questions").insert({
    class_id: classId,
    question,
  });

  if (error) throw error;
};

export const removeClassQuestion = async (questionId: string) => {
  ensureConfigured();

  const { error } = await supabase.from("class_questions").delete().eq("id", questionId);
  if (error) throw error;
};

export const submitFeedback = async (input: {
  classId: string;
  satisfaction: number;
  recommend: number;
  comment: string;
  anonymous: boolean;
  studentName: string | null;
  questionAnswers: Array<{
    questionId: string;
    answer: string;
  }>;
}) => {
  ensureConfigured();

  const { data, error } = await supabase
    .from("feedback")
    .insert({
      class_id: input.classId,
      satisfaction: input.satisfaction,
      recommend: input.recommend,
      comment: input.comment || null,
      anonymous: input.anonymous,
      student_name: input.anonymous ? null : input.studentName,
    })
    .select("id")
    .single();

  if (error) throw error;

  const questionAnswers = input.questionAnswers
    .map((item) => ({
      feedback_id: data.id,
      class_question_id: item.questionId,
      answer: item.answer.trim(),
    }))
    .filter((item) => item.answer.length > 0);

  if (questionAnswers.length === 0) {
    return;
  }

  const { error: answersError } = await supabase.from("feedback_question_answers").insert(questionAnswers);
  if (answersError) throw answersError;
};

export const buildTeacherSummaries = (teachers: ProfileRow[], classes: ClassData[]): TeacherSummary[] =>
  teachers.map((teacher) => {
    const teacherClasses = classes.filter((item) => item.teacherId === teacher.id);
    const totalResponses = teacherClasses.reduce((total, item) => total + item.responseCount, 0);
    const totalScore = teacherClasses.reduce((total, item) => total + item.avgSatisfaction, 0);

    return {
      id: teacher.id,
      name: teacher.full_name,
      email: teacher.email,
      department: teacher.department ?? "-",
      status: teacher.status,
      classCount: teacherClasses.length,
      totalResponses,
      avgScore: teacherClasses.length ? Number((totalScore / teacherClasses.length).toFixed(1)) : 0,
    };
  });
