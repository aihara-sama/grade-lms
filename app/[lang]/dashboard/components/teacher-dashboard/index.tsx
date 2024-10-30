"use client";

import DashboardSchedule from "@/app/[lang]/dashboard/components/common/dashboard-schedule";
import LatestCourses from "@/app/[lang]/dashboard/components/teacher-dashboard/latest-courses";
import TeacherInsights from "@/app/[lang]/dashboard/components/teacher-dashboard/teacher-insights";
import Total from "@/components/common/total";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import Container from "@/components/layout/container";
import { type createCourse, type getLatestCourses } from "@/db/client/course";
import type { getDayLessons } from "@/db/server/lesson";
import type { ResultOf } from "@/types/utils.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import { useState } from "react";

interface Props {
  usersCount: number;
  coursesCount: number;
  latestCourses: ResultOf<typeof getLatestCourses>;
  dayLessons: ResultOf<typeof getDayLessons>;
  usersInsights: number[];
  coursesInsights: number[];
}

const TeacherDashboard: FunctionComponent<Props> = ({
  usersCount: initUsersCount,
  coursesCount: initCoursesCount,
  latestCourses: initLatestCourses,
  dayLessons,
}) => {
  // Hooks
  const t = useTranslations();

  const [usersCount] = useState(initUsersCount);
  const [coursesCount, setCoursesCount] = useState(initCoursesCount);
  const [latestCourses, setLatestCourses] = useState(initLatestCourses.data);

  // State

  const onCourseCreated = (course: ResultOf<typeof createCourse>) => {
    setLatestCourses((prev) => [course, ...prev]);
    setCoursesCount((prev) => prev + 1);
  };

  return (
    <Container>
      <p className="page-title">{t("dashboard.title")}</p>
      <p className="text-neutral-500 mb-4">{t("dashboard.sub_title")}</p>
      <div className="sm:flex-row flex gap-8 flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="mb-6">
            <div className="flex flex-wrap gap-6 [&>*]:[@media(min-width:919px)]:w-64">
              <Total
                adaptive={false}
                Icon={<CoursesIcon size="lg" />}
                total={coursesCount}
                title={t("cards.titles.total_courses")}
              />
              <Total
                adaptive={false}
                Icon={<AvatarIcon size="lg" />}
                total={usersCount}
                title={t("cards.titles.total_users")}
              />
            </div>
          </div>
          <hr className="my-4" />
          <LatestCourses
            courses={latestCourses}
            onCourseCreated={onCourseCreated}
          />
          <TeacherInsights courses={latestCourses} />
        </div>
        <div className="sm:w-[284px]">
          <DashboardSchedule dayLessons={dayLessons} />
        </div>
      </div>
    </Container>
  );
};

export default TeacherDashboard;
