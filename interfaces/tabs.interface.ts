import type { Database } from "@/types/supabase.type";
import type { ReactNode } from "react";

export interface ITab {
  title: string;
  Icon: ReactNode;
  content: ReactNode;
  tier: Database["public"]["Enums"]["role"][];
}
