import CourseHeader from "@/components/course/course-header";
import Members from "@/components/course/members";
import { db } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface IProps {
  params: {
    courseId: string;
  };
}
const Page: FunctionComponent<IProps> = async ({ params: { courseId } }) => {
  const [
    {
      data: { user: currentUser },
    },
    currentCourseData,
  ] = await Promise.all([
    createClient().auth.getUser(),
    db
      .from("courses")
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
