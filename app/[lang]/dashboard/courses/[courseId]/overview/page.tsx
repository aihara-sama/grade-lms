import Overview from "@/app/[lang]/dashboard/courses/[courseId]/overview/components/overview";
import { getCourse } from "@/db/server/course";
import { getOngoingLesson } from "@/db/server/lesson";
import type { Metadata } from "next";
import type { FunctionComponent } from "react";

export async function generateMetadata({
  params: { courseId },
}: {
  params: { courseId: string };
}): Promise<Metadata> {
  const { title } = await getCourse(courseId);

  return {
    title,
  };
}

interface Props {
  params: { courseId: string };
}

const Page: FunctionComponent<Props> = async ({ params: { courseId } }) => {
  const course = await getCourse(courseId);
  const ongoingLesson = await getOngoingLesson(courseId);

  return <Overview course={course} ongoingLesson={ongoingLesson} />;
};

export default Page;
