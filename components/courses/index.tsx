"use client";

import CardsContainer from "@/components/cards-container";
import CreateCourse from "@/components/courses/create-course";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState, type FunctionComponent } from "react";

import CardTitle from "@/components/card-title";
import BaseModal from "@/components/common/modals/base-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import type { CourseWithRefsCount } from "@/types/courses.type";
import type { getDictionary } from "@/utils/get-dictionary";
import type { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

interface IProps {
  user: User;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

const Courses: FunctionComponent<IProps> = ({ user, dictionary }) => {
  // State
  const [isDeleteCoursesModalOpen, setIsDeleteCoursesModalOpen] =
    useState(false);
  const [coursesIds, setCoursesIds] = useState<string[]>([]);
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [isCOurseActionPopperOpen, setIsCourseActionsPopperOpen] =
    useState(false);

  // Handdlers
  const getCourses = async () => {
    setIsCoursesLoading(true);

    const { data, error } = await supabaseClient
      .from("users")
      .select("courses(*, lessons(count), users(count))")
      .eq("id", user.id)
      .returns<Record<"courses", CourseWithRefsCount[]>[]>()
      .single();

    if (error) {
      toast.error("Something went wrong");
    } else {
      setCourses(data.courses);
    }
    setIsCoursesLoading(false);
  };
  // const deleteCourse = async (
  //   courseId: string
  // ): Promise<{ error: string | null; data: null }> => {
  //   const { error } = await supabaseClient
  //     .from("courses")
  //     .delete()
  //     .eq("id", courseId);

  //   return {
  //     data: null,
  //     error: error ? error.message : null,
  //   };
  // };
  const handleDeleteCourses = async () => {
    const { error } = await supabaseClient
      .from("courses")
      .delete()
      .in("id", coursesIds);

    if (error) toast.error("Something went wrong");

    setCoursesIds([]);
    setIsDeleteCoursesModalOpen(false);

    getCourses();
  };

  // Effects
  useEffect(() => {
    getCourses();
  }, []);

  const buttonRef = useRef();
  const IconButton = (
    <button
      onClick={() => setIsCourseActionsPopperOpen(true)}
      ref={buttonRef}
      className="icon-button"
    >
      <DotsIcon />
    </button>
  );

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
          placeholder={dictionary.search}
          className="w-auto"
        />
      ) : (
        <div className="mb-3">
          <button
            onClick={() => setIsDeleteCoursesModalOpen(true)}
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
            Lessons: lessons[0].count,
            Members: users[0].count,
            "": (
              <div>
                {IconButton}
                <BasePopper
                  setIsOpen={setIsCourseActionsPopperOpen}
                  isOpen={isCOurseActionPopperOpen}
                  anchorEl={buttonRef}
                >
                  <p>Enroll</p>
                  <p>Delete</p>
                </BasePopper>
              </div>
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
      <BaseModal
        setIsOpen={setIsDeleteCoursesModalOpen}
        isOpen={isDeleteCoursesModalOpen}
        header="Delete courses"
      >
        <p className="mb-4">
          Are you sure you want to delete selected courses?
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="outline-button w-full"
            onClick={() => setIsDeleteCoursesModalOpen(false)}
          >
            Cancel
          </button>
          <button className="primary-button" onClick={handleDeleteCourses}>
            Delete
          </button>
        </div>
      </BaseModal>
    </>
  );
};

export default Courses;
