import type { Database } from "@/types/supabase.type";

export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
