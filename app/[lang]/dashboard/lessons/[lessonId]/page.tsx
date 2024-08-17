import LiveLesson from "@/components/live-lesson";
import { supabaseClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface IProps {
  params: {
    lessonId: string;
  };
}
const Page: FunctionComponent<IProps> = async ({ params: { lessonId } }) => {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  const lesson = await supabaseClient
    .from("lessons")
    .select("*, course:courses(*)")
    .eq("id", lessonId)
    .single();

  if (!lesson.data) {
    return redirect("/dashboard");
  }

  return <LiveLesson lesson={lesson.data} user={user} />;
};

export default Page;