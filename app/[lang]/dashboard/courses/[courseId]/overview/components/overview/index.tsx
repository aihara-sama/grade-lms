"use client";

import Header from "@/app/[lang]/dashboard/courses/[courseId]/components/header";
import Insights from "@/app/[lang]/dashboard/courses/[courseId]/overview/components/overview/insights";
import OngoingLessonCard from "@/app/[lang]/dashboard/courses/[courseId]/overview/components/overview/ongoing-lesson-card";
import Students from "@/app/[lang]/dashboard/courses/[courseId]/overview/components/overview/students";
import Teacher from "@/app/[lang]/dashboard/courses/[courseId]/overview/components/overview/teacher";
import Total from "@/components/common/total";
import AvatarIcon from "@/components/icons/avatar-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import Container from "@/components/layout/container";
import type { getCourse } from "@/db/server/course";
import type { getOngoingLesson } from "@/db/server/lesson";
import { Role } from "@/enums/role.enum";
import type { ResultOf } from "@/types/utils.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface Props {
  course: ResultOf<typeof getCourse>;
  ongoingLesson: ResultOf<typeof getOngoingLesson>;
}

const Overview: FunctionComponent<Props> = ({
  course: { lessons, users, ...course },
  ongoingLesson,
}) => {
  // Hooks
  const t = useTranslations();

  const teacher = users.find(({ role }) => role === "teacher");

  return (
    <Container>
      <Header course={course} />
      <div className="flex gap-8 flex-1 items-start">
        <div className="flex-1">
          <div className="mb-6">
            <p className="section-title">{t("course.title")}</p>
            <div className="flex flex-wrap gap-6">
              <div className="lg:flex gap-6 hidden">
                <Total
                  title={t("cards.titles.total_members")}
                  total={users.length}
                  href={`/dashboard/courses/${course.id}/members`}
                  Icon={<AvatarIcon size="lg" />}
                />
                <Total
                  title={t("cards.titles.total_lessons")}
                  total={lessons.length}
                  href={`/dashboard/courses/${course.id}/lessons`}
                  Icon={<LessonsIcon size="lg" />}
                />
              </div>
              {ongoingLesson && <OngoingLessonCard lesson={ongoingLesson} />}
            </div>
          </div>
          <Insights courseId={course.id} />
        </div>
        <div className="[flex-basis:300px] self-stretch xl:flex flex-col hidden">
          <Teacher teacher={teacher} />
          <Students users={users.filter(({ role }) => role === Role.Student)} />
        </div>
      </div>
    </Container>
  );
};

export default Overview;
