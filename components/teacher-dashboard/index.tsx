"use client";

import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import LatestCourses from "@/components/teacher-dashboard/latest-courses";
import TeacherInsights from "@/components/teacher-dashboard/teacher-insights";
import Total from "@/components/total";
import { getCoursesCount, getLatestCourses } from "@/db/course";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import type { CourseWithRefsCount } from "@/types/course.type";
import type { FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  coursesCount: number;
  usersCount: number;
  latestCourses: CourseWithRefsCount[];
}

const TeacherDashboard: FunctionComponent<Props> = (props) => {
  const [usersCount] = useState(props.usersCount);
  const [coursesCount, setCoursesCount] = useState(props.coursesCount);
  const [latestCourses, setLatestCourses] = useState<CourseWithRefsCount[]>(
    props.latestCourses
  );

  const fetchLatestourses = async () => {
    try {
      const [fetchedCourses, fetchedCoursesCount] = await Promise.all([
        getLatestCourses(),
        getCoursesCount(),
      ]);

      setLatestCourses(fetchedCourses);
      setCoursesCount(fetchedCoursesCount);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  usePushNotifications();

  return (
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
          onCourseCreated={fetchLatestourses}
        />
        <TeacherInsights courses={latestCourses} />
      </div>
      <div className="sm:w-[284px]">
        <DashboardSchedule />
      </div>
    </div>
  );
};

export default TeacherDashboard;
