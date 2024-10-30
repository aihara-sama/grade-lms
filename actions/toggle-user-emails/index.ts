"use server";

import type { ReturnType } from "@/actions/delete-all-users-action/types";
import { adminDB } from "@/lib/supabase/db/admin-db";
import { getServerDB } from "@/lib/supabase/db/get-server-db";

const handler = async (): Promise<ReturnType> => {
  const {
    data: { user },
  } = await getServerDB().auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      data: null,
    };
  }

  const { data: profile, error: profileError } = await getServerDB()
    .from("users")
    .select("creator_id")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return {
      error: "Something went wrong",
      data: null,
    };
  }

  const [
    { data: userSettings, error: userSettingsError },
    { data: isPro, error: isProError },
  ] = await Promise.all([
    adminDB
      .from("user_settings")
      .select("role, is_emails_on")
      .eq("user_id", user.id)
      .single(),
    adminDB.rpc("is_pro", { user_uuids: [user.id, profile.creator_id] }),
  ]);

  if (!userSettings || userSettingsError || isProError) {
    return {
      error: "Something went wrong",
      data: null,
    };
  }

  if (!isPro) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const { error: settingsError } = await adminDB
    .from("user_settings")
    .update({
      is_emails_on: !userSettings.is_emails_on,
    })
    .eq("user_id", user.id);

  console.log({ settingsError });

  return {
    error: settingsError ? "Something went wrong" : null,
    data: null,
  };
};

export const toggleUserEmailsAction = handler;
