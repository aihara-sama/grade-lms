import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { format } from "date-fns";

export const getLesson = async (id: string) => {
  const result = await getServerDB()
    .from("lessons")
    .select("*, course:courses(*)")
    .eq("id", id)
    .single();

  return result.data;
};

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
