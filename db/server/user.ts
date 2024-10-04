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

export const getMyUsers = async (options?: { head?: boolean }) => {
  const { data, count } = await getServerDB()
    .rpc(
      "get_my_users",
      {},
      {
        count: "exact",
        ...options,
      }
    )
    .range(0, USERS_GET_LIMIT - 1)
    .order("created_at", { ascending: true });

  return { data, count };
};
