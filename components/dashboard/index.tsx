"use client";

import CardsContainer from "@/components/cards-container";
import CreateCourseModal from "@/components/common/modals/create-course-modal";
import DashboardSchedule from "@/components/dashboard/dashboard-schedule";
import AvatarIcon from "@/components/icons/avatar-icon";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import PlusIcon from "@/components/icons/plus-icon";
import UsersIcon from "@/components/icons/users-icon";
import Total from "@/components/total";
import type { CourseWithRefsCount } from "@/types/courses.type";
import { supabaseClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  user: User;
  totalCoursesCount: number;
  totalUsersCount: number;
}

const Dashboard: FunctionComponent<IProps> = ({
  user,
  totalUsersCount,
  totalCoursesCount,
}) => {
  const [usersCount] = useState(totalUsersCount);
  const [coursesCount, setCoursesCount] = useState(totalCoursesCount);
  const [latestCourses, setLatestCourses] = useState<CourseWithRefsCount[]>([]);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

  const openCreateCourseModal = () => setIsCreateCourseModalOpen(true);

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
      console.log({ data });

      if (error) {
        toast.error("Something went wrong");
      } else {
        setLatestCourses(data.courses);
      }
    })();
  }, []);

  return (
    <div className="flex gap-8">
      <div className="flex-1">
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
        <h2 className="font-bold text-lg">Latest courses</h2>
        <div className="flex gap-4 mt-2 flex-nowrap overflow-auto">
          {latestCourses.map((course) => (
            <Link
              href={`/dashboard/courses/${course.id}/overview`}
              key={course.id}
              className="border border-neutral-300 rounded-lg px-4 py-2 flex items-center justify-between min-w-56 interactive"
            >
              <div className="flex gap-2 w-full">
                <CourseIcon className="" size="sm" />
                <div
                  className="text-sm flex-1 truncate-fade max-w-24 w-full font-semibold"
                  title={course.title}
                >
                  {course.title}
                </div>
              </div>
              <div className="flex gap-3 items-center text-neutral-600">
                <div>
                  <div>
                    <UsersIcon size="xs" />
                  </div>
                  <div>{course.users[0].count}</div>
                </div>
                <div>
                  <div>
                    <LessonsIcon size="xs" />
                  </div>
                  <div>{course.lessons[0].count}</div>
                </div>
              </div>
            </Link>
          ))}
          <div
            onClick={openCreateCourseModal}
            className="size-14 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-500 interactive"
          >
            <PlusIcon size="sm" />
          </div>
        </div>
      </div>
      <DashboardSchedule user={user} />
      <CreateCourseModal
        onDone={handleGetCourses}
        isOpen={isCreateCourseModalOpen}
        setIsOpen={setIsCreateCourseModalOpen}
      />
    </div>
  );
};

export default Dashboard;
