import CourseHeader from "@/components/course/course-header";
import Members from "@/components/course/members";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface Props {
  params: {
    courseId: string;
  };
}
const Page: FunctionComponent<Props> = async ({ params: { courseId } }) => {
  const DB = getServerDB();
  const [
    {
      data: { user: currentUser },
    },
    currentCourseData,
  ] = await Promise.all([
    DB.auth.getUser(),
    DB.from("courses")
      .select("*, users(*), lessons(*)")
      .eq("id", courseId)
      .single(),
  ]);

  const currentCourse = currentCourseData.data;
  if (!currentCourse) return redirect("/dashboard/courses");

  return (
    <div>
      <CourseHeader course={currentCourse} />
      <Members currentUser={currentUser} courseId={currentCourse.id} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
