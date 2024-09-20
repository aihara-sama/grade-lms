import { createUserAction } from "@/actions/create-user-action";
import type { InputType as CreateUserInputType } from "@/actions/create-user-action/types";
import { deleteUserAction } from "@/actions/delete-user-action";
import { editUserAction } from "@/actions/edit-user-action";
import type { InputType as EditUserInputType } from "@/actions/edit-user-action/types";
import { MEMBERS_GET_LIMIT, USERS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import { loadMessages } from "@/utils/localization/load-messages";
import { serverErrToIntlKey } from "@/utils/localization/server-err-to-intl";
import { parseUsersCoursesIds } from "@/utils/parse/parse-users-courses-ids";

// Get
export const getUserById = async (id: string) => {
  const t = await loadMessages();
  const result = await DB.from("users").select("*").eq("id", id).single();

  if (result.error || !result.data) throw new Error(t("failed_to_load_user"));

  return result.data;
};
export const getUsersByCourseId = async (
  courseId: string,
  userName = "",
  from = 0,
  to = MEMBERS_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await DB.from("courses")
    .select("users(*)")
    .eq("id", courseId)
    .ilike("users.name", `%${userName}%`)
    .range(from, to, { foreignTable: "users" })
    .order("created_at", { ascending: true, referencedTable: "users" })
    .single();

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data.users;
};
export const getUsersByCourseIdCount = async (
  courseId: string,
  userName = ""
) => {
  const t = await loadMessages();
  const result = await DB.from("courses")
    .select("users(count)")
    .eq("id", courseId)
    .ilike("users.name", `%${userName}%`)
    .returns<Record<"users", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_users_count"));

  return result.data.users[0].count;
};
export const getUsersByCeratorId = async (
  creatorId: string,
  name = "",
  from = 0,
  to = USERS_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await DB.from("users")
    .select("*")
    .eq("creator_id", creatorId)
    .ilike("name", `%${name}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data;
};

export const getUsersByCreatorIdCount = async (
  creatorId: string,
  name = ""
) => {
  const t = await loadMessages();
  const result = await DB.from("users")
    .select("count")
    .eq("creator_id", creatorId)
    .ilike("name", `%${name}%`)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_users_count"));

  return result.data[0].count;
};

export const getUsersNotInCourse = async (
  courseId: string,
  userName = "",
  from = 0,
  to = USERS_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await DB.rpc("get_users_not_in_course", {
    p_course_id: courseId,
    p_user_name: userName,
  })
    .range(from, to)
    .order("created_at", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data;
};
export const getUsersNotInCourseCount = async (
  courseId: string,
  userName = ""
) => {
  const t = await loadMessages();
  const result = await DB.rpc("get_users_not_in_course", {
    p_course_id: courseId,
    p_user_name: userName,
  })
    .select("count")
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data[0].count;
};
export const getAllCourseStudentsIds = async (
  userId: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await DB.from("courses")
    .select("users(id)")
    .eq("id", courseId)
    .neq("users.id", userId)
    .single();

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data.users;
};

export const deleteUserById = async (id: string) => {
  const t = await loadMessages();
  const result = await deleteUserAction([id]);

  if (result.error) throw new Error(t("failed_to_delete_user"));
};

export const deleteUsersByIds = async (ids: string[]) => {
  const t = await loadMessages();
  const result = await deleteUserAction(ids);

  if (result.error) throw new Error(t("failed_to_delete_users"));
};
export const deleteAllUsers = async (userId: string, name: string) => {
  const t = await loadMessages();

  const usersIds = await DB.from("users")
    .select("id")
    .eq("creator_id", userId)
    .ilike("name", `%${name}%`);

  if (usersIds.error) throw new Error(t("failed_to_delete_users"));

  const result = await deleteUserAction(usersIds.data.map(({ id }) => id));

  if (result.error) throw new Error(t("failed_to_delete_users"));
};
export const enrollUsersInCourses = async (
  usersIds: string[],
  coursesIds: string[]
) => {
  const t = await loadMessages();
  const result = await DB.from("user_courses").upsert(
    parseUsersCoursesIds(usersIds, coursesIds)
  );

  if (result.error)
    throw new Error(
      t(
        usersIds.length === 1
          ? "failed_to_enroll_user"
          : "failed_to_enroll_users"
      )
    );
};
export const enrollAllUsersInCourses = async (coursesIds: string[]) => {
  const t = await loadMessages();
  const result = await DB.rpc("enroll_all_users_in_courses", {
    p_courses_ids: coursesIds,
  });

  if (result.error) throw new Error(t("failed_to_enroll_users"));
};
export const enrollAllUsers = async (courseId: string) => {
  const t = await loadMessages();
  const result = await DB.rpc("enroll_all_users", {
    p_course_id: courseId,
  });

  if (result.error) throw new Error(t("failed_to_enroll_users"));
};
export const createUser = async (userDetails: CreateUserInputType) => {
  const t = await loadMessages();
  const result = await createUserAction(userDetails);
  console.log({ result });

  if (result.error) throw new Error(t(serverErrToIntlKey(result.error)));
};
export const editUser = async (userDetails: EditUserInputType) => {
  const t = await loadMessages();
  const result = await editUserAction(userDetails);

  if (result.error) throw new Error(t(serverErrToIntlKey(result.error)));
};

export const dispelUsers = async (courseId: string, usersIds: string[]) => {
  const t = await loadMessages();
  const result = await DB.rpc("dispel_users_from_course", {
    p_course_id: courseId,
    p_users_ids: usersIds,
  });

  if (result.error) throw new Error(t("failed_to_dispel_users"));
};

export const dispelAllUsers = async (courseId: string, userName = "") => {
  const t = await loadMessages();
  const result = await DB.rpc("dispel_all_users_from_course", {
    p_course_id: courseId,
    p_user_name: userName,
  });

  if (result.error) throw new Error(t("failed_to_dispel_users"));
};
