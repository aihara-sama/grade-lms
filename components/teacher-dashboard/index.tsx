"use client";

import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import LatestCourses from "@/components/teacher-dashboard/latest-courses";
import TeacherInsights from "@/components/teacher-dashboard/teacher-insights";
import Total from "@/components/total";
import { getCoursesCount, getLatestCourses } from "@/db/course";
import { useUser } from "@/hooks/use-user";
import { messaging } from "@/lib/firebase/messaging";
import { DB } from "@/lib/supabase/db";
import type { CourseWithRefsCount } from "@/types/course.type";
import { getToken } from "firebase/messaging";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
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

  const { user } = useUser();

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

  useEffect(() => {
    (async () => {
      const { data } = await DB.from("fcm_tokens").select("fcm_token");

      if (
        Notification.permission !== "granted" ||
        (Notification.permission === "granted" && !data.length)
      ) {
        console.log("should ask permission");

        Notification.requestPermission()
          .then((permission) => {
            console.log({ permission });

            if (permission === "granted") {
              getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
              }).then((token) => {
                Promise.all([
                  DB.from("fcm_tokens")
                    .insert({
                      fcm_token: token,
                      user_id: user.id,
                    })
                    .eq("user_id", user.id),
                ])
                  .then(() => toast.success("Notifications enabled!"))
                  .catch(console.error);
              });
            }
          })
          .catch(console.error);
      }
    })();
  }, []);

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
