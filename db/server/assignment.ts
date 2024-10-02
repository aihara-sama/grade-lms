import { ASSIGNMENTS_GET_LIMIT } from "@/constants";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { extractAssignmentsCount } from "@/utils/parse/extract-assignments-count";

export const getLessonAssignments = async (lessonId: string) => {
  const { data, count } = await getServerDB()
    .from("assignments")
    .select("*", { count: "exact" })
    .eq("lesson_id", lessonId)
    .range(0, ASSIGNMENTS_GET_LIMIT - 1)
    .order("created_at", { ascending: true });

  return { data, count };
};

export const getAssignmentsCount = async () => {
  const result = await getServerDB()
    .from("courses")
    .select("lessons(assignments(count))")
    .returns<Record<"lessons", { assignments: { count: number }[] }[]>[]>();

  return extractAssignmentsCount(result.data);
};

export const getLatestAssignments = async () => {
  const { data, count } = await getServerDB()
    .from("assignments")
    .select("*", { count: "exact" })
    .limit(ASSIGNMENTS_GET_LIMIT)
    .order("created_at", { ascending: false });

  return { data, count };
};
