import { ASSIGNMENTS_GET_LIMIT } from "@/constants";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { extractAssignmentsCount } from "@/utils/parse/extract-assignments-count";

export const getAssignmentsCount = async () => {
  const result = await getServerDB()
    .from("courses")
    .select("lessons(assignments(count))")
    .returns<Record<"lessons", { assignments: { count: number }[] }[]>[]>();

  if (result.error) return 0;

  return extractAssignmentsCount(result.data);
};

export const getLatestAssignments = async () => {
  const result = await getServerDB()
    .from("courses")
    .select("lessons(assignments(*))")
    .limit(ASSIGNMENTS_GET_LIMIT)
    .order("created_at", { ascending: false });

  if (result.error) return [];

  return result.data
    .map(({ lessons }) =>
      lessons
        .map(({ assignments }) =>
          assignments.map((assignment) => assignment).flat()
        )
        .flat()
    )
    .flat();
};
