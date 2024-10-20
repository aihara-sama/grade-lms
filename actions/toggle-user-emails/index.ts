"use server";

import type { ReturnType } from "@/actions/delete-all-users-action/types";
import { adminDB } from "@/lib/supabase/db/admin-db";

const handler = async (): Promise<ReturnType> => {
  const {
    data: { user },
  } = await adminDB.auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
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
    adminDB.rpc("is_pro", { user_uuid: user.id }),
  ]);

  if (!userSettings || userSettingsError || isProError) {
    console.log({ userSettingsError, isProError });

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

  if (!isPro) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const [{ error: settingsError }] = await Promise.all([
    adminDB.from("user_settings").update({
      is_emails_on: !userSettings.is_emails_on,
      user_id: user.id,
    }),
  ]);

  console.log({ settingsError });

  return {
    error: settingsError ? "Something went wrong" : null,
    data: null,
  };
};

export const toggleUserEmailsAction = handler;
