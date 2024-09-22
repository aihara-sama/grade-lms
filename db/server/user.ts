import { getServerDB } from "@/lib/supabase/db/get-server-db";

export const getMyUsersCount = async (meId: string) => {
  const result = await getServerDB()
    .from("users")
    .select("count")
    .neq("id", meId)
    .returns<{ count: number }[]>()
    .single();

  if (result.error) return 0;

  return result.data.count;
};
