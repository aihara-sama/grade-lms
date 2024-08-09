import CourseHeader from "@/components/course/course-header";
import Members from "@/components/course/members";
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
  const { data: course, error } = await supabaseClient
    .from("courses")
    .select("*")
    .eq("id", params.courseId)
    .single();

  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (error) return redirect("/dashboard/courses");

  return (
    <div>
      <CourseHeader course={course} />
      <Members user={user} courseId={params.courseId} />
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
