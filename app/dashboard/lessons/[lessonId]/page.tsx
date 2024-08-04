import LiveLesson from "@/components/live-lesson";
import { supabaseClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
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
    .select("*")
    .eq("id", lessonId)
    .single();

  return <LiveLesson lesson={lesson.data} user={user} />;
};

export default Page;
