"use server";

import type { ReturnType } from "@/actions/delete-users-action/types";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";

const handler = async (usersIds: string[]): Promise<ReturnType> => {
  const serverDB = getServerDB();

  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }

  const { data: userSettings, error: userSettingsError } = await getServerDB()
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!userSettings || userSettingsError) {
    return {
      error: "Something went wrong",
      data: null,
    };
  }

  if (userSettings.role !== "teacher") {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  // Check RLS
  const users = await serverDB
    .from("users")
    .select("id")
    .in("id", usersIds)
    .neq("id", user.id);

  const result = await Promise.all(
    users.data.map(({ id }) => adminDB.auth.admin.deleteUser(id))
  );

  return {
    error: result.every((data) => data.error === null)
      ? null
      : "Something went wrong",
    data: null,
  };
};

export const deleteUsersAction = handler;
