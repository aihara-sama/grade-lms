import Assignments from "@/app/[lang]/dashboard/courses/[courseId]/lessons/[lessonId]/assignments/components/assignments";
import { getLessonAssignments } from "@/db/server/assignment";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { type FunctionComponent } from "react";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();

  return {
    title: t("assignments.title"),
  };
};

interface Props {
  params: { lessonId: string };
}

const Page: FunctionComponent<Props> = async ({ params: { lessonId } }) => {
  const assignments = await getLessonAssignments(lessonId);

  return <Assignments assignments={assignments} />;
};

export default Page;
