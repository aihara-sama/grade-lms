import type { Database } from "@/types/supabase.type";

export type SubmissionWithAuthor =
  Database["public"]["Tables"]["submissions"]["Row"] & {
    author: Database["public"]["Tables"]["users"]["Row"];
  };
export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
