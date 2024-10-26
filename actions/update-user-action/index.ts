"use server";

import { UpdateUser } from "@/actions/update-user-action/schema";
import type { InputType, ReturnType } from "@/actions/update-user-action/types";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { createSafeAction } from "@/utils/validation/create-safe-action";

const handler = async (payload: InputType): Promise<ReturnType> => {
  const { password, email, ...restPayload } = payload;

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

  const { data: userToUpdate } = await serverDB
    .from("users")
    .select("creator_id, id")
    .eq("id", payload.id)
    .maybeSingle();

  if (
    !userToUpdate ||
    (userToUpdate.id !== user.id && userToUpdate.creator_id !== user.id)
  ) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }

  const [{ error: userError }, { error: profileError }] = await Promise.all([
    adminDB.auth.admin.updateUserById(payload.id, {
      email,
      password,
    }),
    serverDB
      .from("users")
      .update({ email, ...restPayload })
      .eq("id", payload.id),
  ]);

  return {
    error: userError || profileError ? "Something went wrong" : null,
    data: null,
  };
};

export const updateUserAction = createSafeAction(UpdateUser, handler);
