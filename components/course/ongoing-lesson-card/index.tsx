import { supabaseClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import Link from "next/link";
import { type FunctionComponent } from "react";

interface IProps {
  courseId: string;
}

const OngoingLessonCard: FunctionComponent<IProps> = async ({ courseId }) => {
  const data = await supabaseClient
    .from("courses")
    .select("lessons(*)")
    .eq("id", courseId)
    .lte("lessons.starts", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
    .gte("lessons.ends", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));

  const lesson = data.data?.[0]?.lessons?.[0];

  return (
    <div className="relative flex-1 p-6 flex flex-col items-center justify-center">
      <img
        src="/current-lesson-frame.svg"
        alt=""
        className="absolute top-0 left-0 w-full h-full z-[-1]"
      />
      <p className="text-sm mb-[8px] text-light">Ongoing lesson</p>
      <hr className="w-48 mb-2" />
      <p className="mb-1 text-lg font-bold">{lesson?.title || "No lesson"}</p>
      <Link className="mt-3" href={`/dashboard/lessons/${lesson?.id}`}>
        {lesson && <button className="warning-button w-64">Enter class</button>}
      </Link>
    </div>
  );
};

export default OngoingLessonCard;
