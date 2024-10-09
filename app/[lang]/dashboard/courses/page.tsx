import Courses from "@/app/[lang]/dashboard/courses/components/courses";
import { getCourses } from "@/db/server/course";
import type { Metadata, NextPage } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t("courses.title"),
  };
};

const Page: NextPage = async () => {
  const courses = await getCourses();

  return <Courses courses={courses} />;
};

export default Page;
