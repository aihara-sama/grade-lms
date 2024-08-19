"use client";

import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import CreateCourse from "@/components/courses/create-course";
import CheckIcon from "@/components/icons/check-icon";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import SearchIcon from "@/components/icons/search-icon";
import UsersIcon from "@/components/icons/users-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import type { CourseWithRefsCount } from "@/types/courses.type";
import { supabaseClient } from "@/utils/supabase/client";
import type { User as AuthenticatedUser } from "@supabase/supabase-js";
import throttle from "lodash.throttle";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";

import {
  deleteCourseByCourseId,
  deleteCoursesByCourseIds,
  getCoursesByTitleAndUserId,
  getCoursesByUserId,
  getCoursesCountByTitleAndUserId,
  getCoursesCountByUserId,
  getRangeCoursesByUserId,
} from "@/db/course";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface IProps {
  user: AuthenticatedUser;
}

const Courses: FunctionComponent<IProps> = ({ user }) => {
  // State
  const [isDeleteCoursesModalOpen, setIsDeleteCoursesModalOpen] =
    useState(false);
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);
  const [selectedCoursesIds, setSelectedCoursesIds] = useState<string[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);
  const [totalCoursesCount, setTotalCoursesCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const t = useTranslations();
  // Refs
  const hasMoreCoursesRef = useRef(false);
  const isSelectedAllRef = useRef(false);

  // Handdlers
  const fetchCourses = async () => {
    setIsCoursesLoading(true);
    // toast.error(t("failed-to-create-course"));
    try {
      const [coursesByUserId, coursesCountByUserId] = await Promise.all([
        getCoursesByUserId(user.id),
        getCoursesCountByUserId(user.id),
      ]);

      setCourses(coursesByUserId);
      setTotalCoursesCount(coursesCountByUserId);
      hasMoreCoursesRef.current = coursesByUserId.length === 20;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCoursesLoading(false);
    }
  };

  const deleteSelectedCourse = async () => {
    try {
      await deleteCourseByCourseId(selectedCourseId);

      setSelectedCourseId(undefined);
      setSelectedCoursesIds((prev) =>
        prev.filter((id) => id !== selectedCourseId)
      );
      setIsDeleteCourseModalOpen(false);
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toast.success("Success");
    }
  };

  const deleteAllOwnedCourses = () =>
    supabaseClient.rpc("delete_courses_by_user_with_title_filter", {
      p_user_id: user.id,
      p_title_pattern: searchText,
    });

  const deleteSelectedCourses = async () => {
    const { error } = await (isSelectedAllRef.current
      ? deleteAllOwnedCourses()
      : deleteCoursesByCourseIds(selectedCoursesIds));

    if (error) toast.error("Something went wrong");

    setSelectedCoursesIds([]);
    setIsDeleteCoursesModalOpen(false);

    fetchCourses();
  };
  const openDeleteCoursesModal = () => {
    setIsDeleteCoursesModalOpen(true);
  };
  const onCourseToggle = (checked: boolean, courseId: string) => {
    if (checked) {
      setSelectedCoursesIds((prev) => [...prev, courseId]);
      isSelectedAllRef.current =
        totalCoursesCount === selectedCoursesIds.length + 1;
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== courseId));
      isSelectedAllRef.current =
        totalCoursesCount === selectedCoursesIds.length - 1;
    }
  };
  const selectAllCourses = () => {
    setSelectedCoursesIds(courses.map(({ id }) => id));
    isSelectedAllRef.current = true;
  };
  const deselectAllCourses = () => {
    setSelectedCoursesIds([]);
    isSelectedAllRef.current = false;
  };
  const handleCoursesScroll = async () => {
    if (!isCoursesLoading && hasMoreCoursesRef.current) {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight - 100;

      if (scrollPosition >= bottomPosition) {
        setIsCoursesLoading(true);
        const { data } = await getRangeCoursesByUserId(user.id, 20, 39);

        setCourses((prev) => [...prev, ...data.courses]);
        hasMoreCoursesRef.current = data.courses.length === 20;
        setIsCoursesLoading(false);
        if (isSelectedAllRef.current) {
          setSelectedCoursesIds((prev) => [
            ...prev,
            ...data.courses.map(({ id }) => id),
          ]);
        }
      }
    }
  };
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const handleSearch = async () => {
    const { data, error } = await getCoursesByTitleAndUserId(
      searchText,
      user.id
    );
    const coursesCount = await getCoursesCountByTitleAndUserId(
      searchText,
      user.id
    );
    if (error || coursesCount.error) {
      toast.error("Something went wrong");
    } else {
      setCourses(data.courses);
      setTotalCoursesCount(coursesCount.data.courses[0].count);
    }
  };

  useEffect(() => {
    const throttled = throttle(handleCoursesScroll, 100);
    document.addEventListener("scroll", throttled);

    return () => {
      document.removeEventListener("scroll", throttled);
    };
  }, []);

  // Effects
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  return (
    <div className="pb-8 flex-1 flex flex-col">
      <CardsContainer>
        <Total
          Icon={<CoursesIcon size="lg" />}
          total={totalCoursesCount}
          title="Total courses"
        />
        <CreateCourse userId={user.id} onDone={fetchCourses} />
      </CardsContainer>
      {!selectedCoursesIds.length ? (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder={t("search")}
          className="w-auto"
          value={searchText}
          onChange={handleSearchInputChange}
        />
      ) : (
        <div className="mb-3 flex gap-3">
          <button
            onClick={
              isSelectedAllRef.current ? deselectAllCourses : selectAllCourses
            }
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAllRef.current
              ? totalCoursesCount
              : selectedCoursesIds.length}{" "}
            {isSelectedAllRef.current ? `Deselect` : "Select all"}{" "}
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
                  <ul className="flex flex-col">
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
        onEnrolled={fetchCourses}
      />
    </div>
  );
};

export default Courses;
