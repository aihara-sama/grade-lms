import { LESSONS_GET_LIMIT } from "@/constants";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { addDays, format, startOfDay } from "date-fns";
import { cache } from "react";

export const getLesson = async (id: string) => {
  const result = await getServerDB()
    .from("lessons")
    .select("*, course:courses(*)")
    .eq("id", id)
    .single();

  return result.data;
};

export const getLessonWithCourse = cache(async (id: string) => {
  const result = await getServerDB()
    .from("lessons")
    .select("*, course:courses(*)")
    .eq("id", id)
    .single();

  return result.data;
});

export const getOngoingLesson = async (courseId: string) => {
  const result = await getServerDB()
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .lte("starts", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
    .gte("ends", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
    .single();

  return result.data;
};

export const getCourseLessons = async (courseId: string) => {
  const { data, count } = await getServerDB()
    .from("lessons")
    .select("*", { count: "exact" })
    .eq("course_id", courseId)
    .range(0, LESSONS_GET_LIMIT - 1)
    .order("created_at", { ascending: true });

  return { data, count };
};

export const getDayLessons = async (day: Date) => {
  const { data, count } = await getServerDB()
    .from("lessons")
    .select("*, course:courses(title)")
    .gte("starts", format(day, "yyyy-MM-dd'T'HH:mm:ss"))
    .lt(
      "starts",
      format(`${startOfDay(addDays(day, 1))}`, "yyyy-MM-dd'T'HH:mm:ss")
    );

  return { data, count };
};

export const getWeekLessons = async (days: string[], courseId?: string) => {
  const builder = getServerDB()
    .from("lessons")
    .select("*", { count: "exact" })
    .filter("course_id", "not.is", null)
    .gte("starts", format(days[0], "yyyy-MM-dd'T'HH:mm:ss"))
    .lte(
      "starts",
      format(`${days[days.length - 1]} 23:45:00`, "yyyy-MM-dd'T'HH:mm:ss")
    )
    .order("starts", { ascending: true });

  const { data, count } = await (courseId
    ? builder.eq("course_id", courseId)
    : builder);

  return { data, count };
};
