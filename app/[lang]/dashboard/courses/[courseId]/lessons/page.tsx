import Lessons from "@/app/[lang]/dashboard/courses/[courseId]/lessons/components/lessons";
import { getCourse } from "@/db/server/course";
import { getCourseLessons } from "@/db/server/lesson";
import type { FunctionComponent } from "react";

interface Props {
  params: { courseId: string };
}

const Page: FunctionComponent<Props> = async ({ params: { courseId } }) => {
  const [course, lessons] = await Promise.all([
    getCourse(courseId),
    getCourseLessons(courseId),
  ]);

  return <Lessons course={course} lessons={lessons} />;
};
export default Page;
