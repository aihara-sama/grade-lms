"use server";

import { CreateUser } from "@/actions/create-user-action/schema";
import type { InputType, ReturnType } from "@/actions/create-user-action/types";
import { getMyUsers } from "@/db/server/user";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { createSafeAction } from "@/utils/validation/create-safe-action";
import type { UserMetadata } from "@supabase/supabase-js";

const handler = async (payload: InputType): Promise<ReturnType> => {
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

  const [
    { data: userSettings, error: userSettingsError },
    { data: isPro, error: isProError },
    { data: profile, error: profileError },
  ] = await Promise.all([
    serverDB
      .from("user_settings")
      .select("role, is_emails_on")
      .eq("user_id", user.id)
      .single(),
    serverDB.rpc("is_pro", { user_uuids: [user.id] }),
    serverDB
      .from("users")
      .select("preferred_locale")
      .eq("id", user.id)
      .single(),
  ]);

  if (!userSettings || userSettingsError || isProError || profileError) {
    return {
      error: "Something went wrong",
      data: null,
    };
  }

  if (userSettings.role !== "teacher") {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const { count } = await getMyUsers(user.id, { head: true });

  if (isPro && count >= 20) {
    return {
      error: "You've reached your users limit",
      data: null,
    };
  }
  if (!isPro && count >= 3) {
    return {
      error: "You've reached your users limit",
      data: null,
    };
  }

  const { error, data } = await adminDB.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    user_metadata: {
      name: payload.name,
      creator_id: user.id,
      role: "student",
      avatar: payload.avatar,
      preferred_locale: profile.preferred_locale,
      timezone: payload.timezone,
      is_emails_on: userSettings.is_emails_on,
      push_notifications_state: "idle",
    } as UserMetadata,
    email_confirm: true,
  });

  return {
    error: error ? error.message : null,
    data: error
      ? null
      : {
          avatar: data.user.user_metadata.avatar,
          created_at: data.user.created_at,
          creator_id: data.user.user_metadata.creator_id,
          email: data.user.email,
          id: data.user.id,
          name: data.user.user_metadata.name,
          preferred_locale: data.user.user_metadata.preferred_locale,
          push_notifications_state:
            data.user.user_metadata.push_notifications_state,
          timezone: data.user.user_metadata.timezone,
          user_settings: { role: data.user.user_metadata.role },
        },
  };
};

export const createUserAction = createSafeAction(CreateUser, handler);
