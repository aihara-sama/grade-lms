import { getServerDB } from "@/lib/supabase/db/get-server-db";

export const getSubmissionsCount = async () => {
  const result = await getServerDB()
    .from("submissions")
    .select("count")
    .returns<{ count: number }[]>()
    .single();

  if (result.error) return 0;

  return result.data.count;
};
