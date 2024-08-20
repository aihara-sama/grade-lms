import { createUserAction } from "@/actions/create-user-action";
import type { InputType as UserInputType } from "@/actions/create-user-action/types";
import { deleteUserAction } from "@/actions/delete-user-action";
import { COURSES_GET_LIMIT, USERS_GET_LIMIT } from "@/constants";
import { loadMessages } from "@/utils/load-messages";
import { parseUsersCoursesIds } from "@/utils/parse-users-courses-ids";
import { serverErrToIntlKey } from "@/utils/server-err-to-intl";
import { supabaseClient } from "@/utils/supabase/client";

// Get
export const getUsersByCreatorId = async (creatorId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("*")
    .limit(COURSES_GET_LIMIT)
    .eq("creator_id", creatorId);

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data;
};

export const getUsersCountByCreatorId = async (creatorId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("count")
    .eq("creator_id", creatorId)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_users_count"));

  return result.data[0].count;
};
export const getUsersCountByTitleAndUserId = async (
  name: string,
  creatorId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("count")
    .ilike("name", `%${name}%`)
    .eq("creator_id", creatorId)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_users_count"));

  return result.data[0].count;
};

export const getUsersByNameAndCreatorId = async (
  name: string,
  userId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("*")
    .ilike("name", `%${name}%`)
    .eq("creator_id", userId)
    .limit(USERS_GET_LIMIT)
    .order("name", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data;
};

export const getOffsetUsersByNameAndCreatorId = async (
  name: string,
  creatorId: string,
  from: number,
  to: number
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .select("*")
    .eq("creator_id", creatorId)
    .ilike("name", `%${name}%`)
    .range(from, to)
    .order("name", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data;
};

export const deleteUsersByCreatorId = async (
  creatorId: string,
  usersIds: string[]
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("users")
    .delete()
    .in("id", usersIds)
    .eq("creator_id", creatorId);

  if (result.error) throw new Error(t("failed_to_delete_users"));
};

export const deleteUserByUserId = async (userId: string) => {
  const t = await loadMessages();
  const result = await deleteUserAction(userId);

  if (result.error) throw new Error(t("failed_to_delete_user"));

  return result;
};

export const enrollUsersInCourses = async (
  usersIds: string[],
  coursesIds: string[]
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("user_courses")
    .upsert(parseUsersCoursesIds(usersIds, coursesIds));

  if (result.error)
    throw new Error(
      t(
        usersIds.length === 1
          ? "failed_to_enroll_user"
          : "failed_to_enroll_users"
      )
    );
};
export const createUser = async (userDetails: UserInputType) => {
  const t = await loadMessages();
  const result = await createUserAction(userDetails);
  console.log({ result });

  if (result.error) throw new Error(t(serverErrToIntlKey(result.error)));
};
