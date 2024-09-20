import type { Database } from "@/types/supabase.type";

export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type CourseWithRefsCount = Course & {
  lessons: [{ count: number }];
  users: [{ count: number }];
};
