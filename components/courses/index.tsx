"use client";

import CardTitle from "@/components/card-title";
import CardsContainer from "@/components/cards-container";
import PromptModal from "@/components/common/modals/prompt-modal";
import CreateCourse from "@/components/courses/create-course";
import CheckIcon from "@/components/icons/check-icon";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import type { CourseWithRefsCount } from "@/types/courses.type";
import type { ChangeEvent, FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";

import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import Skeleton from "@/components/skeleton";
import { COURSES_GET_LIMIT } from "@/constants";
import {
  deleteCourseByCourseId,
  deleteCoursesByCoursesIds,
  deleteCoursesByTitleAndUserId,
  getCoursesByTitleAndUserId,
  getCoursesCount,
  getCoursesCountByTitleAndUserId,
  getCoursesWithRefsCount,
  getOffsetCoursesByTitleAndUserId,
} from "@/db/course";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import { isCloseToBottom } from "@/utils/is-document-close-to-bottom";
import { throttleFetch } from "@/utils/throttle-fetch";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface Props {}

const Courses: FunctionComponent<Props> = () => {
  // State
  const [isDeleteCoursesModalOpen, setIsDeleteCoursesModalOpen] =
    useState(false);
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);
  const [selectedCoursesIds, setSelectedCoursesIds] = useState<string[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [totalCoursesCount, setTotalCoursesCount] = useState(0);
  const [coursesSearchText, setCoursesSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [isSubmittingDeleteCourse, setIsSubmittingDeleteCourse] =
    useState(false);
  const [isSubmittingDeleteCourses, setIsSubmittingDeleteCourses] =
    useState(false);

  // Refs
  const isSelectedAllRef = useRef(false);
  const coursesOffsetRef = useRef(0);
  const coursesSearchTextRef = useRef("");

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Handdlers
  const selectAllCourses = () => {
    setSelectedCoursesIds(courses.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllCourses = () => {
    setSelectedCoursesIds([]);
    setIsSelectedAll(false);
  };
  const fetchCoursesWithCount = async () => {
    setIsCoursesLoading(true);

    try {
      const [coursesByUserId, coursesCountByUserId] = await Promise.all([
        getCoursesWithRefsCount(
          user.id,
          coursesOffsetRef.current,
          coursesOffsetRef.current + COURSES_GET_LIMIT - 1
        ),
        getCoursesCount(user.id),
      ]);

      setCourses(coursesByUserId);
      setTotalCoursesCount(coursesCountByUserId);
      setIsSelectedAll(false);
      setSelectedCoursesIds([]);
      coursesOffsetRef.current += coursesByUserId.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCoursesLoading(false);
    }
  };
  const fetchCoursesBySearch = async () => {
    try {
      const [coursesByTitleAndUserId, coursesCountByTitleAndUserId] =
        await Promise.all([
          getCoursesByTitleAndUserId(coursesSearchTextRef.current, user.id),
          getCoursesCountByTitleAndUserId(
            coursesSearchTextRef.current,
            user.id
          ),
        ]);

      setCourses(coursesByTitleAndUserId);
      setTotalCoursesCount(coursesCountByTitleAndUserId);
      setIsSelectedAll(false);
      setSelectedCoursesIds([]);
      coursesOffsetRef.current = 0;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteSelectedCourses = async () => {
    setIsSubmittingDeleteCourses(true);
    try {
      await (isSelectedAllRef.current
        ? deleteCoursesByTitleAndUserId(coursesSearchText, user.id)
        : deleteCoursesByCoursesIds(selectedCoursesIds));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSelectedCoursesIds([]);
      setIsDeleteCoursesModalOpen(false);
      fetchCoursesBySearch();
      setIsSubmittingDeleteCourses(false);
    }
  };
  const submitDeleteCourse = async () => {
    setIsSubmittingDeleteCourse(true);
    try {
      await deleteCourseByCourseId(selectedCourseId);
      setIsDeleteCourseModalOpen(false);
      setSelectedCoursesIds((_) => _.filter((id) => id !== selectedCourseId));
      fetchCoursesBySearch();
      toast.success("Success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteCourse(false);
    }
  };
  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoursesSearchText((coursesSearchTextRef.current = e.target.value));
    fetchCoursesBySearch();
  };
  const fetchMoreCourses = async () => {
    try {
      const rangeCoursesByUserId = await getOffsetCoursesByTitleAndUserId(
        user.id,
        coursesSearchTextRef.current,
        coursesOffsetRef.current,
        coursesOffsetRef.current + COURSES_GET_LIMIT - 1
      );

      setCourses((prev) => [...prev, ...rangeCoursesByUserId]);

      if (isSelectedAllRef.current) {
        setSelectedCoursesIds((prev) => [
          ...prev,
          ...rangeCoursesByUserId.map(({ id }) => id),
        ]);
      }

      coursesOffsetRef.current += rangeCoursesByUserId.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onCoursesScroll = async (e: Event) => {
    if (isCloseToBottom(e.target as HTMLElement)) {
      fetchMoreCourses();
    }
  };
  const onCourseToggle = (checked: boolean, courseId: string) => {
    if (checked) {
      setSelectedCoursesIds((prev) => [...prev, courseId]);
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length + 1);
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== courseId));
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length - 1);
    }
  };
  // Effects
  useEffect(() => {
    const throttled = throttleFetch(onCoursesScroll);
    document
      .getElementById("content-wrapper")
      .addEventListener("scroll", throttled);

    return () => {
      document
        .getElementById("content-wrapper")
        .removeEventListener("scroll", throttled);
    };
  }, []);
  useEffect(() => {
    fetchCoursesWithCount();
  }, []);
  useEffect(() => {
    coursesSearchTextRef.current = coursesSearchText;
  }, [coursesSearchText]);
  useEffect(() => {
    isSelectedAllRef.current = isSelectedAll;
  }, [isSelectedAll]);
  useEffect(() => {
    setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length);
  }, [totalCoursesCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records. This will fit the screen
    if (courses.length && totalCoursesCount !== courses.length) {
      const contentWrapper = document.getElementById("content-wrapper");
      if (contentWrapper.scrollHeight === contentWrapper.clientHeight) {
        fetchMoreCourses();
      }
    }
  }, [courses, totalCoursesCount]);

  // View
  return (
    <div className="pb-8 flex-1 flex flex-col">
      <CardsContainer>
        <Total
          Icon={<CoursesIcon size="lg" />}
          total={totalCoursesCount}
          title="Total courses"
        />
        {user.role === Role.Teacher && (
          <CreateCourse onCreated={fetchCoursesBySearch} />
        )}
      </CardsContainer>
      {selectedCoursesIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={isSelectedAll ? deselectAllCourses : selectAllCourses}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? totalCoursesCount : selectedCoursesIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsDeleteCoursesModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      ) : (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder={t("search")}
          className="w-auto"
          onChange={onSearchInputChange}
          value={coursesSearchText}
        />
      )}
      {isCoursesLoading ? (
        <Skeleton />
      ) : (
        <div className="flex-1 flex">
          <Table
            data={courses.map(({ id, title, lessons, users: members }) => ({
              Name: (
                <CardTitle
                  href={`/dashboard/courses/${id}/overview`}
                  checked={selectedCoursesIds.includes(id)}
                  Icon={<CourseIcon />}
                  title={title}
                  subtitle="Active"
                  onToggle={
                    user.role === Role.Teacher
                      ? (checked) => onCourseToggle(checked, id)
                      : undefined
                  }
                />
              ),
              Lessons: lessons[0].count,
              Members: members[0].count,
              "": user.role === Role.Teacher && (
                <BasePopper
                  width="sm"
                  trigger={
                    <button
                      className="icon-button text-neutral-500"
                      onClick={() => setSelectedCourseId(id)}
                    >
                      <DotsIcon />
                    </button>
                  }
                >
                  <ul className="flex flex-col">
                    <li
                      className="popper-list-item"
                      onClick={() => setIsEnrollUsersModalOpen(true)}
                    >
                      <UsersIcon /> Enroll
                    </li>
                    <li
                      className="popper-list-item"
                      onClick={() => setIsDeleteCourseModalOpen(true)}
                    >
                      <DeleteIcon /> Delete
                    </li>
                  </ul>
                </BasePopper>
              ),
            }))}
          />
        </div>
      )}

      {isDeleteCoursesModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDeleteCourses}
          onClose={() => setIsDeleteCoursesModalOpen(false)}
          title="Delete courses"
          action="Delete"
          body="Are you sure you want to delete selected courses?"
          actionHandler={submitDeleteSelectedCourses}
        />
      )}
      {isDeleteCourseModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDeleteCourse}
          onClose={() => setIsDeleteCourseModalOpen(false)}
          title="Delete course"
          action="Delete"
          body="Are you sure you want to delete this course?"
          actionHandler={submitDeleteCourse}
        />
      )}
      {isEnrollUsersModalOpen && (
        <EnrollUsersInCourseModal
          courseId={selectedCourseId}
          onClose={() => setIsEnrollUsersModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Courses;
