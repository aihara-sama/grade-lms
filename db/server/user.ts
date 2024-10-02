import { MEMBERS_GET_LIMIT, USERS_GET_LIMIT } from "@/constants";
import { getServerDB } from "@/lib/supabase/db/get-server-db";

export const getCourseUsers = async (courseId: string) => {
  const { data, count } = await getServerDB()
    .from("users")
    .select("*, courses!inner(id)", { count: "exact" })
    .eq("courses.id", courseId)
    .range(0, MEMBERS_GET_LIMIT - 1)
    .order("created_at", { ascending: true });

  return { data, count };
};
export const getMyUsers = async (meId: string) => {
  const { data, count } = await getServerDB()
    .from("users")
    .select("*", { count: "exact" })
    .neq("id", meId)
    .order("created_at", { ascending: true })
    .range(0, USERS_GET_LIMIT - 1);

  return { data, count };
};

export const getMyUsersCount = async (meId: string) => {
  const { count } = await getServerDB()
    .from("users")
    .select("*", { count: "exact", head: true })
    .neq("id", meId)
    .returns<{ count: number }[]>()
    .single();

  return count;
};
