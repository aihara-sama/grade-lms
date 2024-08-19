"use client";

import CardsContainer from "@/components/cards-container";
import DashboardSchedule from "@/components/common/dashboard/dashboard-schedule";
import AvatarIcon from "@/components/icons/avatar-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import LatestCourses from "@/components/teacher-dashboard/latest-courses";
import TeacherInsights from "@/components/teacher-dashboard/teacher-insights";
import Total from "@/components/total";
import type { CourseWithRefsCount } from "@/types/courses.type";
import { supabaseClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// const handleRequest = async (builder: ?, success: string, error: string) => {
//   const result = await builder;

//   if (result.error) toast.error(error);
//   else toast.success(success);
// };

interface IProps {
  user: User;
  totalCoursesCount: number;
  totalUsersCount: number;
}

const TeacherDashboard: FunctionComponent<IProps> = ({
  user,
  totalUsersCount,
  totalCoursesCount,
}) => {
  const [usersCount] = useState(totalUsersCount);
  const [coursesCount, setCoursesCount] = useState(totalCoursesCount);
  const [latestCourses, setLatestCourses] = useState<CourseWithRefsCount[]>([]);

  // const fetchUsersCount = () =>
  //   supabaseClient
  //     .from("users")
  //     .select("courses(count)")
  //     .eq("id", user.id)
  //     .returns<Record<"courses", { count: number }[]>[]>()
  //     .single();

  const fetchCoursesCount = () =>
    supabaseClient
      .from("users")
      .select("courses(count)")
      .eq("id", user.id)
      .returns<Record<"courses", { count: number }[]>[]>()
      .single();

  const fetchLatestCourses = () =>
    supabaseClient
      .from("users")
      .select("courses(*, users(count), lessons(count))")
      .eq("id", user.id)
      .limit(10)
      .order("created_at", { ascending: true, referencedTable: "courses" })
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

  return (
    <div className="flex gap-8">
      <div className="flex-1 overflow-hidden">
        <CardsContainer>
          <Total
            Icon={<CoursesIcon size="lg" />}
            total={coursesCount}
            title="Total courses"
          />
          <Total
            Icon={<AvatarIcon size="lg" />}
            total={usersCount}
            title="Total users"
          />
        </CardsContainer>
        <hr className="my-4" />
        <LatestCourses
          courses={latestCourses}
          onCourseCreated={handleGetCourses}
        />
        <TeacherInsights user={user} courses={latestCourses} />
      </div>
      <div className="w-[278px]">
        <DashboardSchedule user={user} />
      </div>
    </div>
  );
};

export default TeacherDashboard;
