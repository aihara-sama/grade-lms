import type { Database } from "@/types/supabase.type";
import type { ReactNode } from "react";

export interface MenuItem {
  title: string;
  href: string;
  Icon: ReactNode;
  tier: Database["public"]["Enums"]["role"][];
}
