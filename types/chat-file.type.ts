import type { Database } from "@/types/supabase.type";

export type ChatFile = Database["public"]["Tables"]["chat_files"]["Row"];
