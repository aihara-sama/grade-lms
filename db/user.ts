import { createUserAction } from "@/actions/create-user-action";
import type { InputType as UserInputType } from "@/actions/create-user-action/types";
import { deleteUserAction } from "@/actions/delete-user-action";
import { COURSES_GET_LIMIT, USERS_GET_LIMIT } from "@/constants";
import { ROLES } from "@/interfaces/user.interface";
import { loadMessages } from "@/utils/load-messages";
import { parseUsersCoursesIds } from "@/utils/parse-users-courses-ids";
import { serverErrToIntlKey } from "@/utils/server-err-to-intl";
import { supabaseClient } from "@/utils/supabase/client";

// Get
export const getUsersByCourseId = async (courseId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("courses")
    .select("users(*)")
    .eq("id", courseId)
    .limit(USERS_GET_LIMIT, { foreignTable: "users" })
    .order("created_at", { ascending: true, referencedTable: "users" })
    .single();

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data.users;
};

export const getUsersCountByCourseId = async (courseId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("courses")
    .select("users(count)")
    .eq("id", courseId)
    .returns<Record<"users", { count: number }[]>[]>()
    .single();

  if (result.error) throw new Error(t("failed_to_load_users_count"));

  return result.data.users[0].count;
};
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
export const getUsersCountByTitleAndCourseId = async (
  name: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
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
export const getUsersByNameAndCourseId = async (
  name: string,
  courseId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
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
  const result = await supabaseClient
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
  const result = await supabaseClient
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

export const getUsersNotInCourse = async (userId: string, courseId: string) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .rpc("get_users_not_in_course", {
      p_course_id: courseId,
    })
    .eq("creator_id", userId)
    .neq("id", userId);

  if (result.error) throw new Error(t("failed_to_load_users"));

  return result.data;
};

export const deleteUsersByUsersIds = async (usersIds: string[]) => {
  const t = await loadMessages();
  const result = await deleteUserAction(usersIds);

  if (result.error) throw new Error(t("failed_to_delete_users"));
};
export const deleteUsersByNameAndCreatorId = async (
  name: string,
  creatorId: string
) => {
  const t = await loadMessages();

  const usersIds = await supabaseClient
    .from("users")
    .select("id")
    .ilike("name", `%${name}%`)
    .eq("creator_id", creatorId);

  if (usersIds.error) throw new Error(t("failed_to_delete_users"));

  const result = await deleteUserAction(usersIds.data.map(({ id }) => id));

  if (result.error) throw new Error(t("failed_to_delete_users"));
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

  if (result.error) throw new Error(t(serverErrToIntlKey(result.error)));
};

export const dispelUsersFromCourse = async (
  usersIds: string[],
  courseId: string
) => {
  const t = await loadMessages();
  const result = await supabaseClient
    .from("user_courses")
    .delete()
    .in("user_id", usersIds)
    .eq("course_id", courseId);

  if (result.error)
    throw new Error(
      t(
        usersIds.length === 1
          ? "failed_to_dispel_user"
          : "failed_to_dispel_users"
      )
    );
};
export const dispelAllStudentsByNameFromCourse = async (
  name: string,
  courseId: string
) => {
  const t = await loadMessages();

  const studentsData = await supabaseClient
    .from("users")
    .select("id")
    .ilike("name", `%${name}%`)
    .eq("role", ROLES.STUDENT);

  if (studentsData.error) throw new Error(t("failed_to_dispel_users"));

  const result = await supabaseClient
    .from("user_courses")
    .delete()
    .in(
      "user_id",
      studentsData.data.map(({ id }) => id)
    )
    .eq("course_id", courseId);

  if (result.error) throw new Error(t("failed_to_dispel_users"));
};
