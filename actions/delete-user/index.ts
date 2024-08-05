"use server";

import type { ReturnType } from "@/actions/delete-user/types";
import { ROLES } from "@/interfaces/user.interface";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const handler = async (userId: string): Promise<ReturnType> => {
  const currentUserPromise = createClient().auth.getUser();
  const targetUserPromise = supabaseAdmin
    .from("users")
    .select("creator_id")
    .eq("id", userId)
    .single();

  const [currentUser, targetUser] = await Promise.all([
    currentUserPromise,
    targetUserPromise,
  ]);

  if (!currentUser.data.user) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }
  if (!targetUser.data) {
    return {
      error: "User not Found",
      data: null,
    };
  }

  if (
    targetUser.data.creator_id !== currentUser.data.user.id ||
    currentUser.data.user.user_metadata.role !== ROLES.TEACHER
  ) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  return {
    error: error ? error.message : null,
    data: null,
  };
};

export const deleteUser = handler;
