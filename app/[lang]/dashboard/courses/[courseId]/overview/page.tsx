import CourseHeader from "@/components/course/course-header";
import CourseInsights from "@/components/course/course-insights";
import OngoingLessonCard from "@/components/course/ongoing-lesson-card";
import Students from "@/components/course/students";
import Teacher from "@/components/course/teacher";
import AvatarIcon from "@/components/icons/avatar-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import Total from "@/components/total";
import { Role } from "@/interfaces/user.interface";
import { db } from "@/utils/supabase/client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { FunctionComponent } from "react";

export async function generateMetadata({
  params,
}: {
  params: { courseId: string };
}): Promise<Metadata> {
  const data = await db
    .from("courses")
    .select("title")
    .eq("id", params.courseId)
    .single();

  return {
    title: data?.data?.title,
  };
}

interface Props {
  params: {
    courseId: string;
  };
}

const Page: FunctionComponent<Props> = async ({ params }) => {
  const courseData = await db
    .from("courses")
    .select("*, users(*), lessons(*)")
    .eq("id", params.courseId)
    .single();

  const currentCourse = courseData.data;

  if (!currentCourse) return redirect("/dashboard/courses");

  const { users, lessons, ...courseRest } = currentCourse;

  const teacher = users.find((user) => user.role === Role.Teacher);

  return (
    <div>
      <CourseHeader course={currentCourse} />
      <div className="flex gap-8 flex-1 items-start">
        <div className="flex-1">
          <div className="mb-6">
            <p className="section-title">Overview</p>
            <div className="flex flex-wrap gap-6">
              <div className="lg:flex gap-6 hidden">
                <Total
                  title="Total members"
                  total={users.length}
                  link={`/dashboard/courses/${courseRest.id}/members`}
                  Icon={<AvatarIcon size="lg" />}
                />
                <Total
                  title="Total lessons"
                  total={lessons.length}
                  link={`/dashboard/courses/${courseRest.id}/lessons`}
                  Icon={<LessonsIcon size="lg" />}
                />
              </div>
              <OngoingLessonCard courseId={params.courseId} />
            </div>
          </div>
          <CourseInsights courseId={params.courseId} />
        </div>
        <div className="[flex-basis:300px] self-stretch xl:flex flex-col hidden">
          <Teacher teacher={teacher} />
          <Students
            users={users.filter((user) => user.role === Role.Student)}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
