"use client";

import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import Container from "@/components/container";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import LatestCourses from "@/components/teacher-dashboard/latest-courses";
import TeacherInsights from "@/components/teacher-dashboard/teacher-insights";
import Total from "@/components/total";
import { getLatestCourses } from "@/db/client/course";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUser } from "@/hooks/use-user";
import type { CourseWithRefsCount } from "@/types/course.type";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  coursesCount: number;
  usersCount: number;
  latestCourses: CourseWithRefsCount[];
}

const TeacherDashboard: FunctionComponent<Props> = (props) => {
  const { enablePushNotifications } = usePushNotifications();
  const user = useUser((state) => state.user);

  const [usersCount] = useState(props.usersCount);
  const [coursesCount, setCoursesCount] = useState(props.coursesCount);
  const [latestCourses, setLatestCourses] = useState<CourseWithRefsCount[]>(
    props.latestCourses
  );

  const fetchLatestourses = async () => {
    try {
      const { data, count } = await getLatestCourses();

      setLatestCourses(data);
      setCoursesCount(count);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    (async () => {
      if (!user.is_push_notifications_on) {
        try {
          const permission = await Notification.requestPermission();

          if (permission === "granted") await enablePushNotifications();

          toast.success("Notifications enabled!");
        } catch (err: any) {
          console.error(err.message);
        }
      }
    })();
  }, []);

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
            onCourseCreated={fetchLatestourses}
          />
          <TeacherInsights courses={latestCourses} />
        </div>
        <div className="sm:w-[284px]">
          <DashboardSchedule />
        </div>
      </div>
    </Container>
  );
};

export default TeacherDashboard;
