"use server";

import { EditUser } from "@/actions/edit-user-action/schema";
import type { InputType, ReturnType } from "@/actions/edit-user-action/types";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import { createSafeAction } from "@/utils/create-safe-action";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const handler = async (payload: InputType): Promise<ReturnType> => {
  const { password, ...restPayload } = payload;

  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }

  if (user.user_metadata.role !== Role.Teacher) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const [{ error: userError }, { error: profileError }] = await Promise.all([
    supabaseAdmin.auth.admin.updateUserById(payload.id, {
      email: payload.email,
      password,
      user_metadata: {
        name: payload.name,
        avatar: payload.avatar,
        timezone: payload.timezone,
      } as IUserMetadata,
    }),
    supabaseAdmin.from("users").update(restPayload).eq("id", payload.id),
  ]);

  return {
    error: userError?.message || profileError?.message || null,
    data: null,
  };
};

export const editUserAction = createSafeAction(EditUser, handler);
