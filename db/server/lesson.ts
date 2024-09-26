import { getServerDB } from "@/lib/supabase/db/get-server-db";

export const getLesson = async (id: string) => {
  const result = await getServerDB()
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  return result.data;
};
