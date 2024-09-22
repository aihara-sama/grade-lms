import { createUserAction } from "@/actions/create-user-action";
import type { InputType as CreateUserInputType } from "@/actions/create-user-action/types";
import { deleteAllUsersAction } from "@/actions/delete-all-users-action";
import { deleteUsersAction } from "@/actions/delete-users-action";
import { updateUserAction } from "@/actions/update-user-action";
import type { InputType as UpdateUserInputType } from "@/actions/update-user-action/types";
import { MEMBERS_GET_LIMIT, USERS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import { loadMessages } from "@/utils/localization/load-messages";
import { serverErrToIntlKey } from "@/utils/localization/server-err-to-intl";
import { parseUsersCoursesIds } from "@/utils/parse/parse-users-courses-ids";

// GET
export const getUser = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("users").select("*").eq("id", id).single();

  if (result.error || !result.data) throw new Error(t("failed_to_load_user"));

  return result.data;
};

export const getUsers = async (
  userName = "",
  from = 0,
  to = USERS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const result = await DB.from("users")
    .select("*")
    .ilike("name", `%${userName}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data;
};
export const getUsersCount = async (userName = "") => {
  const t = await loadMessages();

  const result = await DB.from("users")
    .select("count")
    .ilike("name", `%${userName}%`)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_users_count"));

  return result.data[0].count;
};

export const getCourseUsers = async (
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
export const getCourseUsersCount = async (courseId: string, userName = "") => {
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

// CREATE
export const createUser = async (userDetails: CreateUserInputType) => {
  const t = await loadMessages();

  const result = await createUserAction(userDetails);

  if (result.error) throw new Error(t(serverErrToIntlKey(result.error)));
};

// UPDATE
export const updateUser = async (userDetails: UpdateUserInputType) => {
  const t = await loadMessages();

  const result = await updateUserAction(userDetails);

  if (result.error) throw new Error(t(serverErrToIntlKey(result.error)));
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
export const enrollUsersInAllCourses = async (usersIds: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("enroll_users_in_all_courses", {
    users_ids: usersIds,
  });

  if (result.error) throw new Error(t("failed_to_enroll_users"));
};
export const enrollAllUsersInCourses = async (coursesIds: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("enroll_all_users_in_courses", {
    p_courses_ids: coursesIds,
  });

  if (result.error) throw new Error(t("failed_to_enroll_users"));
};
export const enrollAllUsersInAllCourses = async () => {
  const t = await loadMessages();

  const result = await DB.rpc("enroll_all_users_in_all_courses");

  if (result.error) throw new Error(t("failed_to_enroll_users"));
};

// DELETE
export const deleteUser = async (id: string) => {
  const t = await loadMessages();

  const result = await deleteUsersAction([id]);

  if (result.error) throw new Error(t("failed_to_delete_user"));
};
export const deleteUsers = async (ids: string[]) => {
  const t = await loadMessages();

  const result = await deleteUsersAction(ids);

  if (result.error) throw new Error(t("failed_to_delete_users"));
};
export const deleteAllUsers = async (userName: string) => {
  const t = await loadMessages();

  const result = await deleteAllUsersAction({ userName });

  if (result.error) throw new Error(t("failed_to_delete_users"));
};

export const deleteUsersFromCourse = async (
  courseId: string,
  usersIds: string[]
) => {
  const t = await loadMessages();

  const result = await DB.rpc("dispel_users_from_course", {
    p_course_id: courseId,
    p_users_ids: usersIds,
  });

  if (result.error) throw new Error(t("failed_to_dispel_users"));
};
export const deleteAllUsersFromCourse = async (
  courseId: string,
  userName = ""
) => {
  const t = await loadMessages();

  const result = await DB.rpc("dispel_all_users_from_course", {
    p_course_id: courseId,
    p_user_name: userName,
  });

  if (result.error) throw new Error(t("failed_to_dispel_users"));
};
