import type { Database } from "@/types/supabase.type";
import type { ReactNode } from "react";

export interface IMenuItem {
  title: string;
  href: string;
  Icon: ReactNode;
  tier: Database["public"]["Enums"]["role"][];
}

export interface ITabItem extends IMenuItem {}

export interface ISelectItem {
  title: string;
  id: string;
}
