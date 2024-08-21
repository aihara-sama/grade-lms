"use server";

import type { ReturnType } from "@/actions/delete-user-action/types";
import { ROLES } from "@/interfaces/user.interface";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const handler = async (usersIds: string[]): Promise<ReturnType> => {
  const currentUser = await createClient().auth.getUser();
  if (!currentUser.data.user) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }

  if (currentUser.data.user.user_metadata.role !== ROLES.TEACHER) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const result = await Promise.all(
    usersIds.map((userId) => supabaseAdmin.auth.admin.deleteUser(userId))
  );

  return {
    error: result.every((data) => data.error === null)
      ? null
      : "Something went wrong",
    data: null,
  };
};

export const deleteUserAction = handler;
