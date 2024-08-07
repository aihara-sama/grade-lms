"use client";

import DeleteButton from "@/components/buttons/delete-button";
import CardsContainer from "@/components/cards-container";
import CreateCourse from "@/components/courses/create-course";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";

import CardTitle from "@/components/card-title";
import DeleteIcon from "@/components/icons/delete-icon";
import Modal from "@/components/modal";
import type { Database } from "@/types/supabase.type";
import type { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

interface IProps {
  user: User;
}

const Courses: FunctionComponent<IProps> = ({ user }) => {
  const [isDeleteBulkCoursesModalOpen, setIsDeleteBulkCoursesModalOpen] =
    useState(false);
  const [coursesIds, setCoursesIds] = useState<string[]>([]);
  const [courses, setCourses] = useState<
    (Database["public"]["Tables"]["courses"]["Row"] & {
      lessons: Database["public"]["Tables"]["lessons"]["Row"][];
      users: Database["public"]["Tables"]["users"]["Row"][];
    })[]
  >([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);

  const getCourses = async () => {
    setIsCoursesLoading(true);

    const data = await supabaseClient
      .from("users")
      .select("id, courses(*, lessons(*), users(*))")
      .eq("id", user.id)
      .single();

    setIsCoursesLoading(false);
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

  const handleBulkDeleteCourses = async () => {
    const { error } = await supabaseClient
      .from("courses")
      .delete()
      .in("id", coursesIds);

    if (error) toast.error("Something went wrong");

    setCoursesIds([]);
    setIsDeleteBulkCoursesModalOpen(false);

    getCourses();
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
      {!coursesIds.length ? (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
        />
      ) : (
        <div className="mb-3">
          <button
            onClick={() => setIsDeleteBulkCoursesModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      )}
      {!isCoursesLoading && (
        <Table
          data={courses.map(({ id, title, lessons, users }) => ({
            Name: (
              <CardTitle
                href={`/dashboard/courses/${id}/overview`}
                checked={coursesIds.includes(id)}
                Icon={<CourseIcon />}
                title={title}
                subtitle="Active"
                onClick={() => {}}
                onToggle={(checked) =>
                  checked
                    ? setCoursesIds((prev) => [...prev, id])
                    : setCoursesIds((prev) => prev.filter((_id) => _id !== id))
                }
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
      )}

      {!courses.length && !isCoursesLoading && (
        <div className="flex justify-center mt-12">
          <div>
            <p className="text-xl mb-8 text-center font-bold">No results</p>
            <div>
              <img src="/no-data.svg" alt="" />
            </div>
          </div>
        </div>
      )}
      {isDeleteBulkCoursesModalOpen && (
        <Modal
          close={() => setIsDeleteBulkCoursesModalOpen(false)}
          title="Delete courses"
          content={
            <>
              <p className="mb-4">
                Are you sure you want to delete selected courses?
              </p>
              <div className="group-buttons">
                <button
                  className="outline-button w-full"
                  onClick={() => setIsDeleteBulkCoursesModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={handleBulkDeleteCourses}
                >
                  Delete
                </button>
              </div>
            </>
          }
        />
      )}
    </>
  );
};

export default Courses;
