"use server";

import type { ReturnType } from "@/actions/delete-user-action/types";
import { Role } from "@/interfaces/user.interface";
import { adminDB } from "@/lib/supabase/db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";

const handler = async (usersIds: string[]): Promise<ReturnType> => {
  const currentUser = await getServerDB().auth.getUser();
  if (!currentUser.data.user) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }

  if (currentUser.data.user.user_metadata.role !== Role.Teacher) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const result = await Promise.all(
    usersIds.map((userId) => adminDB.auth.admin.deleteUser(userId))
  );

  return {
    error: result.every((data) => data.error === null)
      ? null
      : "Something went wrong",
    data: null,
  };
};

export const deleteUserAction = handler;
