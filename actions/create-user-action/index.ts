"use server";

import { CreateUser } from "@/actions/create-user-action/schema";
import type { InputType, ReturnType } from "@/actions/create-user-action/types";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { ROLES } from "@/interfaces/user.interface";
import { createSafeAction } from "@/utils/create-safe-action";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const handler = async (payload: InputType): Promise<ReturnType> => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }

  if (user.user_metadata.role !== ROLES.TEACHER) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    user_metadata: {
      name: payload.name,
      creator_id: user.id,
      role: ROLES.STUDENT,
      avatar: payload.avatar,
      preferred_locale: (user.user_metadata as IUserMetadata).preferred_locale,
    } as IUserMetadata,
    email_confirm: true,
  });

  return {
    error: error ? error.message : null,
    data: null,
  };
};

export const createUserAction = createSafeAction(CreateUser, handler);
