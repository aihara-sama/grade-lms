import { createUserAction } from "@/actions/create-user-action";
import type { InputType as UserInputType } from "@/actions/create-user-action/types";
import { deleteUserAction } from "@/actions/delete-user-action";
import { MEMBERS_GET_LIMIT, USERS_GET_LIMIT } from "@/constants";
import { loadMessages } from "@/utils/load-messages";
import { parseUsersCoursesIds } from "@/utils/parse-users-courses-ids";
import { serverErrToIntlKey } from "@/utils/server-err-to-intl";
import { db } from "@/utils/supabase/client";

// Get
export const getUsersByCourseId = async (
  courseId: string,
  userName = "",
  from = 0,
  to = MEMBERS_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await db
    .from("courses")
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
  const result = await db
    .from("courses")
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
  const result = await db
    .from("users")
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
  const result = await db
    .from("users")
    .select("count")
    .eq("creator_id", creatorId)
    .ilike("name", `%${name}%`)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_users_count"));

  return result.data[0].count;
};
export const getUsersCountByTitleAndUserId = async (
  name: string,
  creatorId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("count")
    .ilike("name", `%${name}%`)
    .eq("creator_id", creatorId)
    .returns<{ count: number }[]>();

  if (result.error) throw new Error(t("failed_to_load_users_count"));

  return result.data[0].count;
};
export const getUsersCountByTitleAndCourseId = async (
  name: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("courses")
    .select("users(count)")
    .ilike("users.name", `%${name}%`)
    .eq("id", courseId)
    .returns<Record<"users", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_users_count"));

  return result.data.users[0].count;
};

export const getUsersByNameAndCreatorId = async (
  name: string,
  userId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("*")
    .ilike("name", `%${name}%`)
    .eq("creator_id", userId)
    .limit(USERS_GET_LIMIT)
    .order("created_at", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data;
};
export const getUsersByNameAndCourseId = async (
  name: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await db
    .from("courses")
    .select("users(*)")
    .ilike("users.name", `%${name}%`)
    .eq("id", courseId)
    .limit(USERS_GET_LIMIT, { foreignTable: "users" })
    .order("name", { ascending: true, referencedTable: "users" })
    .single();

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data.users;
};

export const getOffsetUsersByNameAndCreatorId = async (
  name: string,
  creatorId: string,
  from: number,
  to: number
) => {
  const t = await loadMessages();
  const result = await db
    .from("users")
    .select("*")
    .eq("creator_id", creatorId)
    .ilike("name", `%${name}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data;
};
export const getOffsetUsersByNameAndCourseId = async (
  name: string,
  courseId: string,
  from: number,
  to: number
) => {
  const t = await loadMessages();
  const result = await db
    .from("courses")
    .select("users(*)")
    .eq("id", courseId)
    .ilike("users.name", `%${name}%`)
    .range(from, to, { foreignTable: "users" })
    .order("created_at", { ascending: true, referencedTable: "users" })
    .single();

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data.users;
};

export const getUsersNotInCourse = async (
  courseId: string,
  userName = "",
  from = 0,
  to = USERS_GET_LIMIT - 1
) => {
  const t = await loadMessages();
  const result = await db
    .rpc("get_users_not_in_course", {
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
  const result = await db
    .rpc("get_users_not_in_course", {
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
  const result = await db
    .from("courses")
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

  const usersIds = await db
    .from("users")
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
  const result = await db
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
export const enrollAllUsers = async (courseId: string) => {
  const t = await loadMessages();
  const result = await db.rpc("enroll_all_users", {
    p_course_id: courseId,
  });

  if (result.error) throw new Error(t("failed_to_enroll_users"));
};
export const createUser = async (userDetails: UserInputType) => {
  const t = await loadMessages();
  const result = await createUserAction(userDetails);

  if (result.error) throw new Error(t(serverErrToIntlKey(result.error)));
};

export const dispelUsers = async (courseId: string, usersIds: string[]) => {
  const t = await loadMessages();
  const result = await db
    .from("user_courses")
    .delete()
    .in("user_id", usersIds)
    .eq("course_id", courseId);

  if (result.error) throw new Error(t("failed_to_dispel_users"));
};

export const dispelAllUsers = async (courseId: string, userName = "") => {
  const t = await loadMessages();
  const result = await db.rpc("dispel_all_users_from_course", {
    p_course_id: courseId,
    p_user_name: userName,
  });

  if (result.error) throw new Error(t("failed_to_dispel_users"));
};
