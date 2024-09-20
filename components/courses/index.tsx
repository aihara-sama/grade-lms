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
import type { CourseWithRefsCount } from "@/types/course.type";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import DotsIcon from "@/components/icons/dots-icon";
import NoDataIcon from "@/components/icons/no-data-icon";
import NotFoundIcon from "@/components/icons/not-found-icon";
import UsersIcon from "@/components/icons/users-icon";
import Skeleton from "@/components/skeleton";
import { COURSES_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import {
  deleteAllCourses,
  deleteCourseById,
  deleteCoursesByIds,
  getCourses,
  getCoursesCount,
} from "@/db/course";
import { Role } from "@/enums/role.enum";
import { useUser } from "@/hooks/use-user";
import { isCloseToBottom } from "@/utils/DOM/is-document-close-to-bottom";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const Courses: FunctionComponent = () => {
  // State
  const [isDeleteCoursesModalOpen, setIsDeleteCoursesModalOpen] =
    useState(false);
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);
  const [selectedCoursesIds, setSelectedCoursesIds] = useState<string[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCoursesCount, setTotalCoursesCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [isSubmittingDeleteCourse, setIsSubmittingDeleteCourse] =
    useState(false);
  const [isSubmittingDeleteCourses, setIsSubmittingDeleteCourses] =
    useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const coursesOffsetRef = useRef(0);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Vars
  const isData = !!courses.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !totalCoursesCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !courses.length && !!searchText.length;

  // Handdlers

  const selectAllCourses = () => {
    setSelectedCoursesIds(courses.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllCourses = () => {
    setSelectedCoursesIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialCourses = async () => {
    setIsLoading(true);

    try {
      const [fetchedCourses, fetchedCoursesCount] = await Promise.all([
        getCourses(user.id),
        getCoursesCount(user.id),
      ]);

      setCourses(fetchedCourses);
      setTotalCoursesCount(fetchedCoursesCount);

      coursesOffsetRef.current = fetchedCourses.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCoursesBySearch = async (search: string, refetch?: boolean) => {
    setIsSearching(true);

    try {
      const [fetchedCourses, fetchedCoursesCount] = await Promise.all([
        getCourses(user.id, search),
        getCoursesCount(user.id, search),
      ]);

      setCourses(fetchedCourses);
      setTotalCoursesCount(fetchedCoursesCount);

      setIsSelectedAll(false);
      setSelectedCoursesIds([]);

      coursesOffsetRef.current += refetch ? fetchedCourses.length : 0;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSearching(false);
    }
  };
  const fetchMoreCourses = async () => {
    try {
      const from = coursesOffsetRef.current;
      const to = coursesOffsetRef.current + COURSES_GET_LIMIT - 1;

      const fetchedCourses = await getCourses(user.id, searchText, from, to);

      setCourses((prev) => [...prev, ...fetchedCourses]);

      if (isSelectedAll) {
        setSelectedCoursesIds((prev) => [
          ...prev,
          ...fetchedCourses.map(({ id }) => id),
        ]);
      }

      coursesOffsetRef.current += fetchedCourses.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteCourse = async () => {
    setIsSubmittingDeleteCourse(true);

    try {
      await deleteCourseById(selectedCourseId);

      setIsDeleteCourseModalOpen(false);
      setSelectedCoursesIds((_) => _.filter((id) => id !== selectedCourseId));
      fetchCoursesBySearch(searchText, true);

      toast.success("Success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteCourse(false);
    }
  };
  const submitDeleteCourses = async () => {
    setIsSubmittingDeleteCourses(true);

    try {
      await (isSelectedAll
        ? deleteAllCourses(searchText)
        : deleteCoursesByIds(selectedCoursesIds));

      setSelectedCoursesIds([]);
      setIsDeleteCoursesModalOpen(false);
      fetchCoursesBySearch(searchText, true);
      toast.success("success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteCourses(false);
    }
  };

  const throttledSearch = useCallback(
    throttleSearch((search) => {
      if (search) {
        fetchCoursesBySearch(search);
      } else {
        fetchInitialCourses();
      }
    }, THROTTLE_SEARCH_WAIT),
    []
  );

  const onCourseToggle = (checked: boolean, courseId: string) => {
    if (checked) {
      setSelectedCoursesIds((prev) => [...prev, courseId]);
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length + 1);
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== courseId));
      setIsSelectedAll(totalCoursesCount === selectedCoursesIds.length - 1);
    }
  };
  const onCoursesScroll = async (e: Event) => {
    if (isCloseToBottom(e.target as HTMLElement)) {
      fetchMoreCourses();
    }
  };

  const onEnrollUsersInCourseModalClose = (mutated?: boolean) => {
    setIsEnrollUsersModalOpen(false);

    if (mutated) {
      fetchCoursesBySearch(searchText, true);
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
        ?.removeEventListener("scroll", throttled);
    };
  }, [isSelectedAll, searchText]);

  useEffect(() => throttledSearch(searchText), [searchText]);

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
          <CreateCourse
            onCreated={() => fetchCoursesBySearch(searchText, true)}
          />
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
          StartIcon={<SearchIcon size="xs" />}
          placeholder={t("search")}
          className="w-auto"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      )}
      {isLoading && <Skeleton />}
      {isData && (
        <Table
          data={courses.map(({ id, title, lessons, users: members }, idx) => ({
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
                placement={
                  courses.length > 7 && courses.length - idx < 4
                    ? "top"
                    : "bottom"
                }
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
      )}
      {isNoData && (
        <div className="flex justify-center mt-12">
          <div className="flex flex-col items-center">
            <NoDataIcon />
            <p className="mt-4 font-bold">View your work in a list</p>
          </div>
        </div>
      )}
      {isNotFound && (
        <div className="flex justify-center mt-12">
          <div className="flex flex-col items-center">
            <NotFoundIcon />
            <p className="mt-4 font-bold">
              It looks like we can&apos;t find any results for that match
            </p>
          </div>
        </div>
      )}

      {isDeleteCoursesModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDeleteCourses}
          onClose={() => setIsDeleteCoursesModalOpen(false)}
          title="Delete courses"
          action="Delete"
          body="Are you sure you want to delete selected courses?"
          actionHandler={submitDeleteCourses}
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
          onClose={onEnrollUsersInCourseModalClose}
        />
      )}
    </div>
  );
};

export default Courses;
