import CourseHeader from "@/components/course/course-header";
import Lessons from "@/components/course/lessons";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface Props {
  params: {
    courseId: string;
  };
}
const Page: FunctionComponent<Props> = async ({ params }) => {
  const { data: course, error } = await createClient()
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
