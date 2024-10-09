import Lessons from "@/app/[lang]/dashboard/courses/[courseId]/lessons/components/lessons";
import { getCourse } from "@/db/server/course";
import { getCourseLessons } from "@/db/server/lesson";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { FunctionComponent } from "react";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t("lessons.title"),
  };
};

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
