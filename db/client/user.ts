import { createUserAction } from "@/actions/create-user-action";
import type { InputType as CreateUserInputType } from "@/actions/create-user-action/types";
import { deleteAllUsersAction } from "@/actions/delete-all-users-action";
import { deleteUsersAction } from "@/actions/delete-users-action";
import { toggleUserEmailsAction } from "@/actions/toggle-user-emails";
import { updateUserAction } from "@/actions/update-user-action";
import type { InputType as UpdateUserInputType } from "@/actions/update-user-action/types";
import { MEMBERS_GET_LIMIT, USERS_GET_LIMIT } from "@/constants";
import { DB } from "@/lib/supabase/db";
import { loadMessages } from "@/utils/localization/load-messages";
import { serverErrToIntlKey } from "@/utils/localization/server-err-to-intl";
import { parseUsersCoursesIds } from "@/utils/parse/parse-users-courses-ids";
import { addDays, format, subWeeks } from "date-fns";

// GET
export const getUser = async (id: string) => {
  const t = await loadMessages();

  const result = await DB.from("users").select("*").eq("id", id).single();

  if (result.error || !result.data)
    throw new Error(t("error.failed_to_load_user"));

  return result.data;
};
export const getMyUsers = async (
  userName = "",
  from = 0,
  to = USERS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.rpc(
    "get_my_users",
    {},
    {
      count: "exact",
    }
  )
    .ilike("name", `%${userName}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (error) throw new Error(t("error.failed_to_load_users"));

  return { data, count };
};
export const getMytUsersCount = async () => {
  const { count } = await DB.rpc(
    "get_my_users",
    {},
    {
      count: "exact",
      head: true,
    }
  );

  return { count };
};
export const getUsersInsights = async () => {
  const t = await loadMessages();

  const { data, count, error } = await DB.rpc(
    "get_my_users",
    {},
    { count: "exact" }
  )
    .gte(
      "created_at",
      format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
    )
    .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
    .select("timestamp:created_at");

  if (error) throw new Error(t("error.failed_to_load_users"));

  return { data, count };
};
export const getMembersInsights = async (courseId: string) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("user_courses")
    .select("timestamp:created_at")
    .eq("course_id", courseId)
    .gte(
      "created_at",
      format(addDays(subWeeks(new Date(), 1), 1), "yyyy-MM-dd'T'HH:mm:ss")
    )
    .lte("created_at", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));

  if (error) throw new Error(t("error.failed_to_load_members_insights"));

  return { data, count };
};

export const getCourseUsers = async (
  courseId: string,
  userName = "",
  from = 0,
  to = MEMBERS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.from("users")
    .select("*, courses!inner(id)", { count: "exact" })
    .eq("courses.id", courseId)
    .ilike("name", `%${userName}%`)
    .range(from, to)
    .order("created_at", { ascending: true });

  if (error) throw new Error(t("error.failed_to_load_users"));

  return { data, count };
};

export const getUsersNotInCourse = async (
  courseId: string,
  userName = "",
  from = 0,
  to = USERS_GET_LIMIT - 1
) => {
  const t = await loadMessages();

  const { data, count, error } = await DB.rpc(
    "get_users_not_in_course",
    {
      p_course_id: courseId,
      p_user_name: userName,
    },
    { count: "exact" }
  )
    .range(from, to)
    .order("created_at", { ascending: true });

  if (error) throw new Error(t("error.failed_to_load_users"));

  return { data, count };
};

// CREATE
export const createUser = async (userDetails: CreateUserInputType) => {
  const t = await loadMessages();

  const { data, error } = await createUserAction(userDetails);

  if (error) throw new Error(t(serverErrToIntlKey(error)));

  return { data };
};

// UPDATE
export const updateUser = async (userDetails: UpdateUserInputType) => {
  const t = await loadMessages();

  const result = await updateUserAction(userDetails);

  if (result.error) throw new Error(t(serverErrToIntlKey(result.error)));
};

export const toggleUserEmails = async () => {
  const t = await loadMessages();

  const result = await toggleUserEmailsAction();

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
          ? "error.failed_to_enroll_user"
          : "error.failed_to_enroll_users"
      )
    );
};
export const enrollUsersInAllCourses = async (usersIds: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("enroll_users_in_all_courses", {
    users_ids: usersIds,
  });

  if (result.error) throw new Error(t("error.failed_to_enroll_users"));
};
export const enrollAllUsersInCourses = async (coursesIds: string[]) => {
  const t = await loadMessages();

  const result = await DB.rpc("enroll_all_users_in_courses", {
    p_courses_ids: coursesIds,
  });

  if (result.error) throw new Error(t("error.failed_to_enroll_users"));
};
export const enrollAllUsersInAllCourses = async () => {
  const t = await loadMessages();

  const result = await DB.rpc("enroll_all_users_in_all_courses");

  if (result.error) throw new Error(t("error.failed_to_enroll_users"));
};

// DELETE
export const deleteUser = async (id: string) => {
  const t = await loadMessages();

  const result = await deleteUsersAction([id]);

  if (result.error) throw new Error(t("error.failed_to_delete_user"));
};
export const deleteUsers = async (ids: string[]) => {
  const t = await loadMessages();

  const result = await deleteUsersAction(ids);

  if (result.error) throw new Error(t("error.failed_to_delete_users"));
};
export const deleteAllUsers = async (userName: string) => {
  const t = await loadMessages();

  const result = await deleteAllUsersAction({ userName });

  if (result.error) throw new Error(t("error.failed_to_delete_users"));
};

export const deleteUsersFromCourse = async (
  courseId: string,
  usersIds: string[]
) => {
  const t = await loadMessages();

  const result = await DB.rpc("expel_users_from_course", {
    p_course_id: courseId,
    p_users_ids: usersIds,
  });

  if (result.error) throw new Error(t("error.failed_to_expel_members"));
};
export const deleteAllUsersFromCourse = async (
  courseId: string,
  userName = ""
) => {
  const t = await loadMessages();

  const result = await DB.rpc("expel_all_users_from_course", {
    p_course_id: courseId,
    p_user_name: userName,
  });

  if (result.error) throw new Error(t("error.failed_to_expel_members"));
};
