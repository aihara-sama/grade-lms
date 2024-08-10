import type { Database } from "@/types/supabase.type";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
