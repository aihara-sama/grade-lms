import { ASSIGNMENTS_GET_LIMIT } from "@/constants";
import { getServerDB } from "@/lib/supabase/db/get-server-db";

export const getAssignments = async (options?: { head?: boolean }) => {
  const { data, count } = await getServerDB()
    .from("assignments")
    .select("*", { count: "exact", ...options })
    .range(0, ASSIGNMENTS_GET_LIMIT - 1)
    .order("created_at", { ascending: true });

  return { data, count };
};
export const getLessonAssignments = async (lessonId: string) => {
  const { data, count } = await getServerDB()
    .from("assignments")
    .select("*", { count: "exact" })
    .eq("lesson_id", lessonId)
    .range(0, ASSIGNMENTS_GET_LIMIT - 1)
    .order("created_at", { ascending: true });

  return { data, count };
};

export const getLatestAssignments = async () => {
  const { data, count } = await getServerDB()
    .from("assignments")
    .select("*", { count: "exact" })
    .range(0, ASSIGNMENTS_GET_LIMIT - 1)
    .order("created_at", { ascending: false });

  return { data, count };
};
