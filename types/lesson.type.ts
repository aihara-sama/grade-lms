import type { Database } from "@/types/supabase.type";

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
