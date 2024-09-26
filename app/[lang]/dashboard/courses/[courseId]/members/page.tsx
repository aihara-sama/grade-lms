import CourseHeader from "@/components/course/course-header";
import Members from "@/components/course/members";
import { getCourse } from "@/db/server/course";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface Props {
  params: {
    courseId: string;
  };
}
const Page: FunctionComponent<Props> = async ({ params: { courseId } }) => {
  const [
    {
      data: { user },
    },
    course,
  ] = await Promise.all([getServerDB().auth.getUser(), getCourse(courseId)]);

  if (!course) return redirect("/dashboard/courses");

  return (
    <>
      <CourseHeader course={course} />
      <Members user={user} />
    </>
  );
};

export default Page;
export const dynamic = "force-dynamic";
