import { MEMBERS_GET_LIMIT, USERS_GET_LIMIT } from "@/constants";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { addDays, format, subWeeks } from "date-fns";
import { cache } from "react";

export const getProfile = cache(() => getServerDB().auth.getUser());

export const getMembers = async (courseId: string) => {
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

export const getUsersInsights = async () => {
  const { data, count } = await getServerDB()
    .rpc("get_my_users", {}, { count: "exact" })
    .gte(
      "created_at",
      format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
    )
    .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
    .select("timestamp:created_at");

  return { data, count };
};
