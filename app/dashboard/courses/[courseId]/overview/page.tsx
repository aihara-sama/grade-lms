import CourseHeader from "@/components/course/course-header";
import CourseInsights from "@/components/course/course-insights";
import CurrentLessonCard from "@/components/course/current-lesson-card";
import Students from "@/components/course/students";
import Teacher from "@/components/course/teacher";
import AvatarIcon from "@/components/icons/avatar-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import Total from "@/components/total";
import { ROLES } from "@/interfaces/user.interface";
import { supabaseClient } from "@/utils/supabase/client";
import { format } from "date-fns";

import type { FunctionComponent } from "react";

interface IProps {
  params: {
    courseId: string;
  };
}

const Page: FunctionComponent<IProps> = async ({ params }) => {
  const { data: currentCourse } = await supabaseClient
    .from("courses")
    .select("*, users (*), lessons (*)")
    .eq("id", params.courseId);

  const { data: ongoingCourse } = await supabaseClient
    .from("courses")
    .select("id, lessons (*)")
    .eq("id", params.courseId)
    .lte("lessons.starts", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
    .gte("lessons.ends", format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"));

  const { users, lessons, ...courseRest } = currentCourse[0];

  const teacher = users.find((user) => user.role === ROLES.TEACHER);

  return (
    <div>
      <CourseHeader course={currentCourse[0]} />
      <div className="flex gap-8 flex-1 items-start">
        <div className="flex-1">
          <div className="mb-6">
            <p className="section-title">Overview</p>
            <div className="flex flex-wrap gap-6">
              <div className="lg:flex gap-6 hidden">
                <Total
                  title="Total members"
                  total={users.length}
                  href={`/dashboard/courses/${courseRest?.id}/members`}
                  Icon={<AvatarIcon size="lg" />}
                />
                <Total
                  title="Total lessons"
                  total={lessons.length}
                  href={`/dashboard/courses/${courseRest?.id}/lessons`}
                  Icon={<LessonsIcon size="lg" />}
                />
              </div>
              <CurrentLessonCard
                courseId={courseRest.id}
                duration="0h 32m"
                lessonId={ongoingCourse[0]?.lessons[0]?.id}
                title={ongoingCourse[0]?.lessons[0]?.title}
              />
            </div>
          </div>
          <CourseInsights />
        </div>
        <div className="[flex-basis:300px] self-stretch xl:flex flex-col hidden">
          <Teacher id={teacher.id} name={teacher.name} />
          <Students
            users={users.filter((user) => user.role === ROLES.STUDENT)}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
