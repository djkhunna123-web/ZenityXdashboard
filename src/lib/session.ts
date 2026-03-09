import { mockTeachers } from "@/lib/mockData";

export type UserRole = "admin" | "teacher";

export interface UserSession {
  role: UserRole;
  email: string;
  teacherName: string | null;
}

const SESSION_KEY = "zenityx.session";

export const getTeacherByEmail = (email: string) =>
  mockTeachers.find((teacher) => teacher.email.toLowerCase() === email.toLowerCase()) ?? null;

export const createSession = (email: string): UserSession => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.includes("admin")) {
    return {
      role: "admin",
      email: normalizedEmail,
      teacherName: null,
    };
  }

  const teacher = getTeacherByEmail(normalizedEmail);

  return {
    role: "teacher",
    email: normalizedEmail,
    teacherName: teacher?.name ?? null,
  };
};

export const saveSession = (session: UserSession) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): UserSession | null => {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  window.localStorage.removeItem(SESSION_KEY);
};
