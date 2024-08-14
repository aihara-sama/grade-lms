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
import { useEffect, useState, type FunctionComponent } from "react";

import CardTitle from "@/components/card-title";
import PromptModal from "@/components/common/modals/prompt-modal";
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
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
  const [selectedCoursesIds, setSelectedCoursesIds] = useState<string[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);

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
  const handleDeleteCourse = async (courseId: string) => {
    const { error } = await supabaseClient
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (error) {
      toast.error("Something went wrong");
    } else {
      toast.success("Success");
      setSelectedCourseId(undefined);
      setSelectedCoursesIds((prev) => prev.filter((id) => id !== courseId));
      setIsDeleteCourseModalOpen(false);
      getCourses();
    }
  };
  const handleDeleteCourses = async () => {
    const { error } = await supabaseClient
      .from("courses")
      .delete()
      .in("id", selectedCoursesIds);

    if (error) toast.error("Something went wrong");

    setSelectedCoursesIds([]);
    setIsDeleteCoursesModalOpen(false);

    getCourses();
  };

  // Effects
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
      {!selectedCoursesIds.length ? (
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
                checked={selectedCoursesIds.includes(id)}
                Icon={<CourseIcon />}
                title={title}
                subtitle="Active"
                onClick={() => {}}
                onToggle={(checked) =>
                  checked
                    ? setSelectedCoursesIds((prev) => [...prev, id])
                    : setSelectedCoursesIds((prev) =>
                        prev.filter((_id) => _id !== id)
                      )
                }
              />
            ),
            Lessons: lessons[0].count,
            Members: users[0].count,
            "": (
              <div>
                <BasePopper
                  width="sm"
                  trigger={
                    <button className="icon-button text-neutral-500">
                      <DotsIcon />
                    </button>
                  }
                >
                  <ul className="flex flex-col gap-2 ">
                    <li className="cursor-pointer hover:bg-gray-100 hover:text-link p-2 px-3 flex items-center gap-2">
                      <CoursesIcon size="xs" /> Enroll
                    </li>
                    <li
                      onClick={() => {
                        setSelectedCourseId(id);
                        setIsDeleteCourseModalOpen(true);
                      }}
                      className="cursor-pointer hover:bg-gray-100 hover:text-link p-2 px-3 flex items-center gap-2"
                    >
                      <DeleteIcon /> Delete
                    </li>
                  </ul>
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
      <PromptModal
        setIsOpen={setIsDeleteCoursesModalOpen}
        isOpen={isDeleteCoursesModalOpen}
        title="Delete courses"
        action="Delete"
        body="Are you sure you want to delete selected courses?"
        actionHandler={handleDeleteCourses}
      />
      <PromptModal
        setIsOpen={setIsDeleteCourseModalOpen}
        isOpen={isDeleteCourseModalOpen}
        title="Delete course"
        action="Delete"
        body="Are you sure you want to delete this course?"
        actionHandler={() => handleDeleteCourse(selectedCourseId)}
      />
    </>
  );
};

export default Courses;
