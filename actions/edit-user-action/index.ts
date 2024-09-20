"use server";

import { EditUser } from "@/actions/edit-user-action/schema";
import type { InputType, ReturnType } from "@/actions/edit-user-action/types";
import { Role } from "@/enums/role.enum";
import type { UserMetadata } from "@/interfaces/user.interface";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { createSafeAction } from "@/utils/validation/create-safe-action";

const handler = async (payload: InputType): Promise<ReturnType> => {
  const { password, ...restPayload } = payload;

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
    .update(restPayload)
    .eq("id", payload.id)
    .select("id")
    .maybeSingle();

  if (profileError) {
    return {
      error: profileError.message,
      data: null,
    };
  }

  if (!data) {
    return {
      error: "Something went wrong",
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

export const editUserAction = createSafeAction(EditUser, handler);
