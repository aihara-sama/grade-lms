"use server";

import type { ReturnType } from "@/actions/delete-user-action/types";
import { Role } from "@/interfaces/user.interface";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const handler = async (usersIds: string[]): Promise<ReturnType> => {
  try {
    const currentUser = await createClient().auth.getUser();
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
      usersIds.map((userId) => supabaseAdmin.auth.admin.deleteUser(userId))
    );
    console.log(result.map(({ error }) => error?.message || "").join("|"));

    return {
      error: result.every((data) => data.error === null)
        ? null
        : result.map(({ error }) => error?.message || "").join("|"),
      data: null,
    };
  } catch (err: any) {
    return {
      error: err,
      data: null,
    };
  }
};

export const deleteUserAction = handler;
