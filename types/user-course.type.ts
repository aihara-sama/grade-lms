import type { Database } from "@/types/supabase.type";

export type UserCourses = Database["public"]["Tables"]["user_courses"]["Row"];
