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
import useFetchLock from "@/hooks/use-fetch-lock";
import type { ResultOf } from "@/types/utils.type";
import type { View } from "@/types/view.type";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface Props {
  view: View;
}

const Courses: FunctionComponent<Props> = ({ view }) => {
  // State
  const [isEnrollUsersModal, setIsEnrollUsersModal] = useState(false);
  const [isDeleteCourseModal, setIsDeleteCourseModal] = useState(false);
  const [isDeleteCoursesModal, setIsDeleteCoursesModal] = useState(false);

  const [courses, setCourses] = useState<ResultOf<typeof getCourses>>([]);
  const [coursesCount, setCoursesCount] = useState(0);

  const [courseId, setCourseId] = useState<string>();
  const [coursesIds, setCoursesIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [isSubmittingDelCourse, setIsSubmittingDelCourse] = useState(false);
  const [isSubmittingDelCourses, setIsSubmittingDelCourses] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const coursesOffsetRef = useRef(0);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Hooks
  const t = useTranslations();
  const fetchLock = useFetchLock();

  // Vars
  const isData = !!courses.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !coursesCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !courses.length && !!searchText.length;

  // Handdlers
  const selectAllCourses = () => {
    setCoursesIds(courses.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllCourses = () => {
    setCoursesIds([]);
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
      setCoursesCount(fetchedCoursesCount);

      coursesOffsetRef.current = fetchedCourses.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCoursesBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const [fetchedCourses, fetchedCoursesCount] = await Promise.all([
        getCourses(search),
        getCoursesCount(search),
      ]);

      setCourses(fetchedCourses);
      setCoursesCount(fetchedCoursesCount);

      coursesOffsetRef.current = fetchedCourses.length;
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
        setCoursesIds((prev) => [
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

      setCourses((prev) => prev.filter(({ id }) => id !== courseId));
      setCoursesCount((prev) => prev - 1);

      setCoursesIds((_) => _.filter((id) => id !== courseId));

      setIsDeleteCourseModal(false);

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
      if (isSelectedAll) {
        await deleteAllCourses(searchText);
        setCourses([]);
        setCoursesCount(0);
      } else {
        await deleteCourses(coursesIds);
        setCourses((prev) => prev.filter(({ id }) => !coursesIds.includes(id)));
        setCoursesCount((prev) => prev - coursesIds.length);
      }

      setCoursesIds([]);
      setIsDeleteCoursesModal(false);

      toast.success("success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDelCourses(false);
    }
  };

  const onCourseToggle = (checked: boolean, _course_id: string) => {
    if (checked) {
      setCoursesIds((prev) => [...prev, _course_id]);
      setIsSelectedAll(coursesCount === coursesIds.length + 1);
    } else {
      setCoursesIds((prev) => prev.filter((id) => id !== _course_id));
      setIsSelectedAll(coursesCount === coursesIds.length - 1);
    }
  };
  const onEnrollUsersInCourseModalClose = (usersIds: string[]) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          const membersCount = course.users[0].count;

          course.users = [{ count: membersCount + usersIds.length }];
        }

        return course;
      })
    );

    setIsEnrollUsersModal(false);
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

  // Effects
  useEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    if (coursesCount) setIsSelectedAll(coursesCount === coursesIds.length);
  }, [coursesCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records
    // This will fit the screen with records
    const fn = throttle(() => {
      if (courses.length && coursesCount !== courses.length) {
        if (
          contentWrapperRef.current.scrollHeight ===
          contentWrapperRef.current.clientHeight
        ) {
          fetchLock("courses", fetchMoreCourses)();
        }
      }
    }, 300);
    fn();

    window.addEventListener("resize", fn);

    return () => {
      window.removeEventListener("resize", fn);
    };
  }, [courses, coursesCount]);

  // View
  return (
    <ContentWrapper
      ref={contentWrapperRef}
      onScrollEnd={throttleFetch(fetchLock("courses", fetchMoreCourses))}
    >
      <p className="text-3xl font-bold text-neutral-600">{t("courses")}</p>
      <p className="text-neutral-500">View and manage courses</p>
      <hr className="my-2 mb-4" />
      <div className="pb-8 flex-1 flex flex-col">
        <CardsContainer>
          <Total
            Icon={<CoursesIcon size="lg" />}
            total={coursesCount}
            title="Total courses"
          />
          {view === "Teacher" && (
            <CreateCourse onCreated={() => fetchCoursesBySearch(searchText)} />
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
                      view === "Teacher"
                        ? (checked) => onCourseToggle(checked, id)
                        : undefined
                    }
                  />
                ),
                Lessons: lessons[0].count,
                Members: members[0].count,
                "": view === "Teacher" && (
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
                        onClick={() => setCourseId(id)}
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
