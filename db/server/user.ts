import { MEMBERS_GET_LIMIT, USERS_GET_LIMIT } from "@/constants";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { addDays, format, subWeeks } from "date-fns";
import { cache } from "react";

// GET
export const getCachedUser = cache(() => getServerDB().auth.getUser());

export const getProfile = async (id: string) => {
  const serverDB = getServerDB();

  const [
    {
      data: { user_settings: userSettings, ...user },
    },
    { data: isPro },
  ] = await Promise.all([
    serverDB
      .from("users")
      .select("*, user_settings(role, is_emails_on)")
      .eq("id", id)
      .single(),
    serverDB.rpc("is_pro", {
      user_uuids: [id],
    }),
  ]);

  return {
    ...user,
    role: userSettings.role,
    is_emails_on: userSettings.is_emails_on,
    is_pro: isPro,
  };
};

export const getMembers = async (courseId: string) => {
  const { data, count } = await getServerDB()
    .from("users")
    .select("*, courses!inner(id), user_settings(role)", { count: "exact" })
    .eq("courses.id", courseId)
    .range(0, MEMBERS_GET_LIMIT - 1)
    .order("created_at", { ascending: true });

  return { data, count };
};

export const getMyUsers = async (
  meId: string,
  options?: { head?: boolean }
) => {
  const { data, count } = await getServerDB()
    .from("users")
    .select("*, user_settings(role)", {
      count: "exact",
      ...options,
    })
    .neq("id", meId)
    .range(0, USERS_GET_LIMIT - 1)
    .order("created_at", { ascending: true });

  return { data, count };
};

export const getUsersInsights = async () => {
  const { data, count } = await getServerDB()
    .from("users")
    .select("timestamp:created_at", { count: "exact" })
    .gte(
      "created_at",
      format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
    )
    .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));

  return { data, count };
};
