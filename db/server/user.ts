import { getServerDB } from "@/lib/supabase/db/get-server-db";

export const getUsersCount = async () => {
  const result = await getServerDB()
    .from("users")
    .select("count")
    .returns<{ count: number }[]>()
    .single();

  if (result.error) return 0;

  return result.data.count;
};
