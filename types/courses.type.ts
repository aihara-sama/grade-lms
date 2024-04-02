import type { Database } from "@/types/supabase.type";

export type Course = Database["public"]["Tables"]["courses"]["Row"];
