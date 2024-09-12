"use client";

import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import LatestCourses from "@/components/teacher-dashboard/latest-courses";
import TeacherInsights from "@/components/teacher-dashboard/teacher-insights";
import Total from "@/components/total";
import { useUser } from "@/hooks/use-user";
import type { CourseWithRefsCount } from "@/types/courses.type";
import { messaging, vapidKey } from "@/utils/firebase";
import { db } from "@/utils/supabase/client";
import { getToken } from "firebase/messaging";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  totalCoursesCount: number;
  totalUsersCount: number;
}

const TeacherDashboard: FunctionComponent<Props> = ({
  totalUsersCount,
  totalCoursesCount,
}) => {
  const [usersCount] = useState(totalUsersCount);
  const [coursesCount, setCoursesCount] = useState(totalCoursesCount);
  const [latestCourses, setLatestCourses] = useState<CourseWithRefsCount[]>([]);

  const { user } = useUser();

  const fetchCoursesCount = () =>
    db
      .from("users")
      .select("courses(count)")
      .eq("id", user.id)
      .returns<Record<"courses", { count: number }[]>[]>()
      .single();

  const fetchLatestCourses = () =>
    db
      .from("users")
      .select("courses(*, users(count), lessons(count))")
      .eq("id", user.id)
      .limit(10)
      .order("created_at", { ascending: false, referencedTable: "courses" })
      .returns<Record<"courses", CourseWithRefsCount[]>[]>()
      .single();

  const handleGetCourses = async () => {
    const [
      {
        data: { courses },
        error: latestCoursesError,
      },
      {
        data: { courses: newCoursesCount },
        error: coursesCountError,
      },
    ] = await Promise.all([fetchLatestCourses(), fetchCoursesCount()]);

    if (latestCoursesError || coursesCountError) {
      toast.error("Something went wrong");
    } else {
      setLatestCourses(courses);
      setCoursesCount(newCoursesCount[0].count);
    }
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await fetchLatestCourses();

      if (error) {
        toast.error("Something went wrong");
      } else {
        setLatestCourses(data.courses);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (
        Notification.permission !== "granted" ||
        (Notification.permission === "granted" && !user.fcm_token)
      ) {
        console.log("should ask permission");

        Notification.requestPermission()
          .then((permission) => {
            console.log({ permission });

            if (permission === "granted") {
              getToken(messaging, {
                vapidKey,
              }).then((token) => {
                Promise.all([
                  db
                    .from("users")
                    .update({
                      fcm_token: token,
                    })
                    .eq("id", user.id),
                  db.auth.updateUser({
                    data: {
                      fcm_token: token,
                    },
                  }),
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
          onCourseCreated={handleGetCourses}
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
