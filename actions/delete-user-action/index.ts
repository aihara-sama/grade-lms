"use server";

import type { ReturnType } from "@/actions/delete-user-action/types";
import { Role } from "@/enums/role.enum";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";

const handler = async (usersIds: string[]): Promise<ReturnType> => {
  const serverDB = getServerDB();

  const user = await serverDB.auth.getUser();

  if (!user.data.user) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }

  if (user.data.user.user_metadata.role !== Role.Teacher) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  // Ensure user is authorized
  const users = await serverDB.from("users").select("id").in("id", usersIds);

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

export const deleteUserAction = handler;
