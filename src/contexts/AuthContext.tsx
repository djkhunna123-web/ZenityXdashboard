import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  department: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUpTeacher: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const assertSupabaseConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
};

const getPendingApprovalMessage = (status: Profile["status"]) => {
  if (status === "rejected") {
    return "บัญชีของคุณถูกปฏิเสธการอนุมัติ กรุณาติดต่อผู้ดูแลระบบ";
  }

  return "บัญชีของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const loadProfile = async (user: User | null) => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        setProfile(null);
      } else {
        if (data?.role === "teacher" && data.status !== "approved") {
          await supabase.auth.signOut();
          setSession(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setProfile(data);
      }

      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      void loadProfile(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(true);
      void loadProfile(nextSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      profile,
      loading,
      signIn: async (email, password) => {
        assertSupabaseConfigured();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: nextProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (nextProfile?.role === "teacher" && nextProfile.status !== "approved") {
          await supabase.auth.signOut();
          throw new Error(getPendingApprovalMessage(nextProfile.status));
        }
      },
      signUpTeacher: async ({ email, password, fullName, department }) => {
        assertSupabaseConfigured();
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              department,
            },
          },
        });
        if (error) throw error;
      },
      signOut: async () => {
        if (!isSupabaseConfigured) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [loading, profile, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
