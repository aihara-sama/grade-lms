import type { Database } from "@/types/supabase.type";
import type { ReactNode } from "react";

export interface Tab {
  title: string;
  content: ReactNode;
  Icon: ReactNode;
  tier: Database["public"]["Enums"]["role"][];
}
