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
import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { CourseWithRefsCount } from "@/types/courses.type";
import type { getDictionary } from "@/utils/get-dictionary";
import type { User as AuthenticatedUser } from "@supabase/supabase-js";
import toast from "react-hot-toast";

interface IProps {
  user: AuthenticatedUser;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

const Courses: FunctionComponent<IProps> = ({ user, dictionary }) => {
  // State
  const [isDeleteCoursesModalOpen, setIsDeleteCoursesModalOpen] =
    useState(false);
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);
  const [selectedCoursesIds, setSelectedCoursesIds] = useState<string[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);

  // Handdlers
  const fetchOwnedCourses = async () => {
    const { data, error } = await supabaseClient
      .from("users")
      .select("courses(*, lessons(count), users(count))")
      .eq("id", user.id)
      .limit(20, { foreignTable: "courses" })
      .order("title", { foreignTable: "courses", ascending: true })
      .returns<Record<"courses", CourseWithRefsCount[]>[]>()
      .single();
    console.log({ data });

    if (error) {
      toast.error("Something went wrong");
    } else {
      setCourses(data.courses);
    }
  };
  const deleteSelectedCourse = async () => {
    const { error } = await supabaseClient
      .from("courses")
      .delete()
      .eq("id", selectedCourseId);

    if (error) {
      toast.error("Something went wrong");
    } else {
      toast.success("Success");
      setSelectedCourseId(undefined);
      setSelectedCoursesIds((prev) =>
        prev.filter((id) => id !== selectedCourseId)
      );
      setIsDeleteCourseModalOpen(false);
      fetchOwnedCourses();
    }
  };
  const deleteSelectedCourses = async () => {
    const { error } = await supabaseClient
      .from("courses")
      .delete()
      .in("id", selectedCoursesIds);

    if (error) toast.error("Something went wrong");

    setSelectedCoursesIds([]);
    setIsDeleteCoursesModalOpen(false);

    fetchOwnedCourses();
  };
  const openDeleteCoursesModal = () => {
    setIsDeleteCoursesModalOpen(true);
  };
  const onCourseToggle = (checked: boolean, courseId: string) => {
    if (checked) {
      setSelectedCoursesIds((prev) => [...prev, courseId]);
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== courseId));
    }
  };
  const selectAllCourses = () => {
    setSelectedCoursesIds(courses.map(({ id }) => id));
  };
  const deselectAllCourses = () => {
    setSelectedCoursesIds([]);
  };
  const handleCoursesScroll = async () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.documentElement.scrollHeight - 100;

    if (scrollPosition >= bottomPosition) {
      const { data } = await supabaseClient
        .from("users")
        .select("courses(*, lessons(count), users(count))")
        .eq("id", user.id)
        .range(20, 39, { foreignTable: "courses" }) // Fetch courses from index 21 to 40
        .order("title", { foreignTable: "courses", ascending: true })
        .returns<Record<"courses", CourseWithRefsCount[]>[]>()
        .single();
      setCourses((prev) => [...prev, ...data.courses]);

      console.log({ data });
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", handleCoursesScroll);

    return () => {
      document.removeEventListener("scroll", handleCoursesScroll);
    };
  }, []);

  // Effects
  useEffect(() => {
    fetchOwnedCourses();
  }, []);

  return (
    <div className="pb-8">
      <CardsContainer>
        <Total
          Icon={<CoursesIcon size="lg" />}
          total={courses.length}
          title="Total courses"
        />
        <CreateCourse userId={user.id} onDone={fetchOwnedCourses} />
      </CardsContainer>
      {!selectedCoursesIds.length ? (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder={dictionary.search}
          className="w-auto"
        />
      ) : (
        <div className="mb-3 flex gap-3">
          <button
            onClick={
              selectedCoursesIds.length === courses.length
                ? deselectAllCourses
                : selectAllCourses
            }
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {selectedCoursesIds.length === courses.length
              ? `${selectedCoursesIds.length} Deselect`
              : "Select all"}{" "}
            <CheckIcon size="xs" />
          </button>
          <button
            onClick={openDeleteCoursesModal}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      )}
      <div className="flex-1 flex">
        <Table
          data={courses.map(({ id, title, lessons, users: members }, idx) => ({
            Name: (
              <CardTitle
                href={`/dashboard/courses/${id}/overview`}
                checked={selectedCoursesIds.includes(id)}
                Icon={<CourseIcon />}
                title={title}
                subtitle="Active"
                onToggle={(checked) => onCourseToggle(checked, id)}
              />
            ),
            Lessons: lessons[0].count,
            Members: members[0].count,
            "": (
              <div data-last-course={courses.length - 1 === idx}>
                <BasePopper
                  width="sm"
                  trigger={
                    <button className="icon-button text-neutral-500">
                      <DotsIcon />
                    </button>
                  }
                >
                  <ul className="flex flex-col ">
                    <li
                      onClick={() => {
                        setSelectedCourseId(id);
                        setIsEnrollUsersModalOpen(true);
                      }}
                      className="popper-list-item"
                    >
                      <UsersIcon /> Enroll
                    </li>
                    <li
                      onClick={() => {
                        setSelectedCourseId(id);
                        setIsDeleteCourseModalOpen(true);
                      }}
                      className="popper-list-item"
                    >
                      <DeleteIcon /> Delete
                    </li>
                  </ul>
                </BasePopper>
              </div>
            ),
          }))}
        />
      </div>

      <PromptModal
        setIsOpen={setIsDeleteCoursesModalOpen}
        isOpen={isDeleteCoursesModalOpen}
        title="Delete courses"
        action="Delete"
        body="Are you sure you want to delete selected courses?"
        actionHandler={deleteSelectedCourses}
      />
      <PromptModal
        setIsOpen={setIsDeleteCourseModalOpen}
        isOpen={isDeleteCourseModalOpen}
        title="Delete course"
        action="Delete"
        body="Are you sure you want to delete this course?"
        actionHandler={deleteSelectedCourse}
      />
      <EnrollUsersInCourseModal
        currentUserId={user.id}
        courseId={selectedCourseId}
        isOpen={isEnrollUsersModalOpen}
        setIsOpen={setIsEnrollUsersModalOpen}
        onEnrolled={fetchOwnedCourses}
      />
    </div>
  );
};

export default Courses;
