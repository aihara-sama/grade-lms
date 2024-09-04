import type { ChatFile } from "@/types/chat-files.type";
import type { Database } from "@/types/supabase.type";

export type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];
export type ChatMessageWithFiles = ChatMessage & { chat_files: ChatFile[] };
