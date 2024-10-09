import Schedule from "@/app/[lang]/dashboard/schedule/components/schedule";
import { getCourses } from "@/db/server/course";
import { getWeekLessons } from "@/db/server/lesson";
import { getWeekDays } from "@/utils/date/get-week-days";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t("schedule.title"),
  };
};

const Page = async () => {
  const [courses, weekLessons] = await Promise.all([
    getCourses(),
    getWeekLessons(getWeekDays()),
  ]);

  return <Schedule courses={courses} weekLessons={weekLessons} />;
};

export default Page;
