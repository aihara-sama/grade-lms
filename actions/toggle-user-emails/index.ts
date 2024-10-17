"use server";

import type { ReturnType } from "@/actions/delete-all-users-action/types";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import type { UserMetadata } from "@supabase/supabase-js";

const handler = async (): Promise<ReturnType> => {
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

  const { data: userSettings, error } = await serverDB
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!userSettings || error) {
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

  if (!userSettings.is_pro) {
    return {
      error: "Forbidden",
      data: null,
    };
  }

  const [{ error: profileError }, { error: settingsError }] = await Promise.all(
    [
      serverDB.auth.updateUser({
        data: {
          is_emails_on: !userSettings.is_emails_on,
        } as UserMetadata,
      }),
      serverDB.from("user_settings").update({
        is_emails_on: !userSettings.is_emails_on,
      }),
    ]
  );

  return {
    error: profileError || settingsError ? "Something went wrong" : null,
    data: null,
  };
};

export const toggleUserEmailsAction = handler;