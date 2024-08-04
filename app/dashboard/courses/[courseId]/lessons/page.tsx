import CourseHeader from "@/components/course/course-header";
import Lessons from "@/components/course/lessons";
import { supabaseClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { type FunctionComponent } from "react";

interface IProps {
  params: {
    courseId: string;
  };
}
const Page: FunctionComponent<IProps> = async ({ params }) => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  const { data: course, error } = await supabaseClient
    .from("courses")
    .select("*")
    .eq("id", params.courseId)
    .single();

  if (error) return redirect("/dashboard/courses");

  return (
    <div>
      <CourseHeader course={course} />
      <Lessons courseId={params.courseId} userId={user.id} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
