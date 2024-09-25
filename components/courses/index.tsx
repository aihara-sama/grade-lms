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
import ContentWrapper from "@/components/content-wrapper";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import NoData from "@/components/no-data";
import NotFound from "@/components/not-found";
import Skeleton from "@/components/skeleton";
import { COURSES_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import {
  deleteAllCourses,
  deleteCourse,
  deleteCourses,
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
  const [isEnrollUsersModal, setIsEnrollUsersModal] = useState(false);
  const [isDeleteCourseModal, setIsDeleteCourseModal] = useState(false);
  const [isDeleteCoursesModal, setIsDeleteCoursesModal] = useState(false);

  const [courses, setCourses] = useState<CourseWithRefsCount[]>([]);
  const [courseId, setSelectedCourseId] = useState<string>();
  const [coursesIds, setSelectedCoursesIds] = useState<string[]>([]);

  const [searchText, setSearchText] = useState("");
  const [coursesCount, setTotalCoursesCount] = useState(0);

  const [isSubmittingDelCourse, setIsSubmittingDelCourse] = useState(false);
  const [isSubmittingDelCourses, setIsSubmittingDelCourses] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const coursesOffsetRef = useRef(0);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Vars
  const isData = !!courses.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !coursesCount && !searchText.length;

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
        getCourses(),
        getCoursesCount(),
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
        getCourses(search),
        getCoursesCount(search),
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

      const fetchedCourses = await getCourses(searchText, from, to);

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
    setIsSubmittingDelCourse(true);

    try {
      await deleteCourse(courseId);

      setIsDeleteCourseModal(false);
      setSelectedCoursesIds((_) => _.filter((id) => id !== courseId));
      fetchCoursesBySearch(searchText, true);

      toast.success("Success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDelCourse(false);
    }
  };
  const submitDeleteCourses = async () => {
    setIsSubmittingDelCourses(true);

    try {
      await (isSelectedAll
        ? deleteAllCourses(searchText)
        : deleteCourses(coursesIds));

      setSelectedCoursesIds([]);
      setIsDeleteCoursesModal(false);
      fetchCoursesBySearch(searchText, true);
      toast.success("success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDelCourses(false);
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

  const onCourseToggle = (checked: boolean, _courseId: string) => {
    if (checked) {
      setSelectedCoursesIds((prev) => [...prev, _courseId]);
      setIsSelectedAll(coursesCount === coursesIds.length + 1);
    } else {
      setSelectedCoursesIds((prev) => prev.filter((_id) => _id !== _courseId));
      setIsSelectedAll(coursesCount === coursesIds.length - 1);
    }
  };
  const onCoursesScroll = async (e: Event) => {
    if (isCloseToBottom(e.target as HTMLElement)) {
      fetchMoreCourses();
    }
  };

  const onEnrollUsersInCourseModalClose = (mutated?: boolean) => {
    setIsEnrollUsersModal(false);

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
    setIsSelectedAll(coursesCount === coursesIds.length);
  }, [coursesCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records. This will fit the screen
    if (courses.length && coursesCount !== courses.length) {
      const contentWrapper = document.getElementById("content-wrapper");
      if (contentWrapper.scrollHeight === contentWrapper.clientHeight) {
        fetchMoreCourses();
      }
    }
  }, [courses, coursesCount]);

  // View
  return (
    <ContentWrapper>
      <div className="pb-8 flex-1 flex flex-col">
        <CardsContainer>
          <Total
            Icon={<CoursesIcon size="lg" />}
            total={coursesCount}
            title="Total courses"
          />
          {user.role === Role.Teacher && (
            <CreateCourse
              onCreated={() => fetchCoursesBySearch(searchText, true)}
            />
          )}
        </CardsContainer>
        {coursesIds.length ? (
          <div className="mb-3 flex gap-3">
            <button
              onClick={isSelectedAll ? deselectAllCourses : selectAllCourses}
              className="outline-button flex font-semibold gap-2 items-center"
            >
              {isSelectedAll ? coursesCount : coursesIds.length}{" "}
              {isSelectedAll ? `Deselect` : "Select all"}{" "}
              <CheckIcon size="xs" />
            </button>
            <button
              onClick={() => setIsDeleteCoursesModal(true)}
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
            data={courses.map(
              ({ id, title, lessons, users: members }, idx) => ({
                Name: (
                  <CardTitle
                    href={`/dashboard/courses/${id}/overview`}
                    checked={coursesIds.includes(id)}
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
                        onClick={() => setIsEnrollUsersModal(true)}
                      >
                        <UsersIcon /> Enroll
                      </li>
                      <li
                        className="popper-list-item"
                        onClick={() => setIsDeleteCourseModal(true)}
                      >
                        <DeleteIcon /> Delete
                      </li>
                    </ul>
                  </BasePopper>
                ),
              })
            )}
          />
        )}
        {isNoData && <NoData />}
        {isNotFound && <NotFound />}

        {isDeleteCoursesModal && (
          <PromptModal
            isSubmitting={isSubmittingDelCourses}
            onClose={() => setIsDeleteCoursesModal(false)}
            title="Delete courses"
            action="Delete"
            body="Are you sure you want to delete selected courses?"
            actionHandler={submitDeleteCourses}
          />
        )}
        {isDeleteCourseModal && (
          <PromptModal
            isSubmitting={isSubmittingDelCourse}
            onClose={() => setIsDeleteCourseModal(false)}
            title="Delete course"
            action="Delete"
            body="Are you sure you want to delete this course?"
            actionHandler={submitDeleteCourse}
          />
        )}
        {isEnrollUsersModal && (
          <EnrollUsersInCourseModal
            courseId={courseId}
            onClose={onEnrollUsersInCourseModalClose}
          />
        )}
      </div>
    </ContentWrapper>
  );
};

export default Courses;
