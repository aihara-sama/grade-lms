"use server";

import { CreateUser } from "@/actions/create-user-action/schema";
import type { InputType, ReturnType } from "@/actions/create-user-action/types";
import { Role } from "@/enums/role.enum";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { createSafeAction } from "@/utils/validation/create-safe-action";
import type { UserMetadata } from "@supabase/supabase-js";

const handler = async (payload: InputType): Promise<ReturnType> => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

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

  const { error } = await adminDB.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    user_metadata: {
      name: payload.name,
      creator_id: user.id,
      role: Role.Student,
      avatar: payload.avatar,
      preferred_locale: user.user_metadata.preferred_locale,
      timezone: payload.timezone,
      is_emails_on: true,
      push_notifications_state: "idle",
    } as UserMetadata,
    email_confirm: true,
  });

  return {
    error: error ? error.message : null,
    data: null,
  };
};

export const createUserAction = createSafeAction(CreateUser, handler);
