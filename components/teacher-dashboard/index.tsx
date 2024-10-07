"use client";

import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import Container from "@/components/container";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import LatestCourses from "@/components/teacher-dashboard/latest-courses";
import TeacherInsights from "@/components/teacher-dashboard/teacher-insights";
import Total from "@/components/total";
import type { createCourse, getLatestCourses } from "@/db/client/course";
import type { getDayLessons } from "@/db/server/lesson";
import type { ResultOf } from "@/types/utils.type";
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
  const [usersCount] = useState(initUsersCount);
  const [coursesCount, setCoursesCount] = useState(initCoursesCount);
  const [latestCourses, setLatestCourses] = useState(initLatestCourses.data);

  const onCourseCreated = (course: ResultOf<typeof createCourse>) => {
    setLatestCourses((prev) => [course, ...prev]);
    setCoursesCount((prev) => prev + 1);
  };

  return (
    <Container>
      <p className="page-title">Dashboard</p>
      <p className="text-neutral-500 mb-4">Your LMS Command Center</p>
      <div className="sm:flex-row flex gap-8 flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="mb-6">
            <div className="flex flex-wrap gap-6 [&>*]:[@media(min-width:919px)]:w-64">
              <Total
                adaptive={false}
                Icon={<CoursesIcon size="lg" />}
                total={coursesCount}
                title="Total courses"
              />
              <Total
                adaptive={false}
                Icon={<AvatarIcon size="lg" />}
                total={usersCount}
                title="Total users"
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
