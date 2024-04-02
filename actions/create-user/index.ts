"use server";

import type { IUserMetadata } from "@/interfaces/user.interface";
import { ROLES } from "@/interfaces/user.interface";
import { createSafeAction } from "@/utils/create-safe-action";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { CreateUser } from "./schema";
import type { InputType, ReturnType } from "./types";

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
    } as IUserMetadata,
    email_confirm: true,
  });

  return {
    error: error ? error.message : null,
    data: null,
  };
};

export const createUser = createSafeAction(CreateUser, handler);
