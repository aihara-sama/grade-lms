import CourseHeader from "@/components/course/course-header";
import Lessons from "@/components/course/lessons";
import { getServerDB } from "@/lib/supabase/db/get-server-db";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface Props {
  params: {
    courseId: string;
  };
}
const Page: FunctionComponent<Props> = async ({ params }) => {
  const { data: course, error } = await getServerDB()
    .from("courses")
    .select("*")
    .eq("id", params.courseId)
    .single();

  if (error) return redirect("/dashboard/courses");

  return (
    <div>
      <CourseHeader course={course} />
      <Lessons courseId={params.courseId} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
