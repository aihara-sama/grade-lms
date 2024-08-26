import type { Database } from "@/types/supabase.type";

export type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];
