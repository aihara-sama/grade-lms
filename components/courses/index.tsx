"use client";

import BetterTable from "@/components/better-table";
import DeleteButton from "@/components/buttons/delete-button";
import CardsContainer from "@/components/cards-container";
import CreateCourse from "@/components/courses/create-course";
import IconTitle from "@/components/icon-title";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Total from "@/components/total";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";

import type { Database } from "@/types/supabase.type";
import type { User } from "@supabase/supabase-js";

interface IProps {
  user: User;
}

const Courses: FunctionComponent<IProps> = ({ user }) => {
  const [courses, setCourses] = useState<
    (Database["public"]["Tables"]["courses"]["Row"] & {
      lessons: Database["public"]["Tables"]["lessons"]["Row"][];
      users: Database["public"]["Tables"]["users"]["Row"][];
    })[]
  >([]);

  const getCourses = async () => {
    const data = await supabaseClient
      .from("users")
      .select("id, courses(*, lessons(*), users(*))")
      .eq("id", user.id)
      .single();

    setCourses(data.data.courses);
  };

  const deleteCourse = async (
    courseId: string
  ): Promise<{ error: string | null; data: null }> => {
    const { error } = await supabaseClient
      .from("courses")
      .delete()
      .eq("id", courseId);

    return {
      data: null,
      error: error ? error.message : null,
    };
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      <CardsContainer>
        <Total
          Icon={<CoursesIcon size="lg" />}
          total={courses.length}
          title="Total courses"
        />
        <CreateCourse userId={user.id} onDone={getCourses} />
      </CardsContainer>
      <Input
        Icon={<SearchIcon size="xs" />}
        placeholder="Search"
        className="w-auto"
      />
      <BetterTable
        data={courses.map(({ id, title, lessons, users }) => ({
          Name: (
            <IconTitle
              Icon={<CourseIcon />}
              key={id}
              title={title}
              subtitle=""
              href={`/dashboard/courses/${id}/overview`}
            />
          ),
          Lessons: lessons.length,
          Members: users.length,
          Action: (
            <DeleteButton
              onDone={getCourses}
              action={deleteCourse}
              record="course"
              id={id}
              key={id}
            />
          ),
        }))}
      />
    </>
  );
};

export default Courses;
