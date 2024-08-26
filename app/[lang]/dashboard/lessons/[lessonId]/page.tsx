import LiveLesson from "@/components/live-lesson";
import { supabaseClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

import { type FunctionComponent } from "react";

interface IProps {
  params: {
    lessonId: string;
  };
}
const Page: FunctionComponent<IProps> = async ({ params: { lessonId } }) => {
  const lessonResult = await supabaseClient
    .from("lessons")
    .select("*, course:courses(*)")
    .eq("id", lessonId)
    .single();

  if (!lessonResult.data) {
    return redirect("/dashboard");
  }

  return <LiveLesson lesson={lessonResult.data} />;
};

export default Page;
