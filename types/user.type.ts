import type { Database } from "@/types/supabase.type";

export type User = Database["public"]["Tables"]["users"]["Row"] & {
  isPro: boolean;
};
