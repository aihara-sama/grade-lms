"use server";

import { UpdateUser } from "@/actions/update-user-action/schema";
import type { InputType, ReturnType } from "@/actions/update-user-action/types";
import { Role } from "@/enums/role.enum";
import type { UserMetadata } from "@/interfaces/user.interface";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { createSafeAction } from "@/utils/validation/create-safe-action";

const handler = async (payload: InputType): Promise<ReturnType> => {
  const { password } = payload;

  const serverDB = getServerDB();

  const {
    data: { user },
  } = await serverDB.auth.getUser();

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

  const { error: profileError, data } = await serverDB
    .from("users")
    .select("id")
    .eq("id", payload.id)
    .maybeSingle();

  if (profileError) {
    return {
      error: profileError.message,
      data: null,
    };
  }

  // Did not pass RLS
  if (!data) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const { error: userError } = await adminDB.auth.admin.updateUserById(
    payload.id,
    {
      email: payload.email,
      password,
      user_metadata: {
        name: payload.name,
        avatar: payload.avatar,
        timezone: payload.timezone,
      } as UserMetadata,
    }
  );
  return {
    error: userError ? userError.message : null,
    data: null,
  };
};

export const updateUserAction = createSafeAction(UpdateUser, handler);
