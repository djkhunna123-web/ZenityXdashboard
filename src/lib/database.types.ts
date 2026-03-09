export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          department: string | null;
          role: "admin" | "teacher";
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          department?: string | null;
          role?: "admin" | "teacher";
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string;
          department?: string | null;
          role?: "admin" | "teacher";
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          teacher_id: string;
          teacher_name: string;
          class_number: string;
          course_name: string;
          class_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          teacher_name: string;
          class_number: string;
          course_name: string;
          class_date: string;
          created_at?: string;
        };
        Update: {
          teacher_id?: string;
          teacher_name?: string;
          class_number?: string;
          course_name?: string;
          class_date?: string;
          created_at?: string;
        };
      };
      class_questions: {
        Row: {
          id: string;
          class_id: string;
          question: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          question: string;
          created_at?: string;
        };
        Update: {
          class_id?: string;
          question?: string;
          created_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          class_id: string;
          satisfaction: number;
          recommend: number;
          comment: string | null;
          student_name: string | null;
          anonymous: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          satisfaction: number;
          recommend: number;
          comment?: string | null;
          student_name?: string | null;
          anonymous?: boolean;
          created_at?: string;
        };
        Update: {
          class_id?: string;
          satisfaction?: number;
          recommend?: number;
          comment?: string | null;
          student_name?: string | null;
          anonymous?: boolean;
          created_at?: string;
        };
      };
      feedback_question_answers: {
        Row: {
          id: string;
          feedback_id: string;
          class_question_id: string;
          answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          feedback_id: string;
          class_question_id: string;
          answer: string;
          created_at?: string;
        };
        Update: {
          feedback_id?: string;
          class_question_id?: string;
          answer?: string;
          created_at?: string;
        };
      };
    };
  };
}
