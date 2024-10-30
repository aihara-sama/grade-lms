import Overview from "@/app/[lang]/dashboard/courses/[courseId]/overview/components/overview";
import { getCourse } from "@/db/server/course";
import type { Metadata } from "next";
import type { FunctionComponent } from "react";

export const generateMetadata = async ({
  params: { courseId },
}: {
  params: { courseId: string };
}): Promise<Metadata> => {
  const { title } = await getCourse(courseId);

  return {
    title,
  };
};

interface Props {
  params: { courseId: string };
}

const Page: FunctionComponent<Props> = async ({ params: { courseId } }) => {
  const course = await getCourse(courseId);

  return <Overview course={course} />;
};

export default Page;
