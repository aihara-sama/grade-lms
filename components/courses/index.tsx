"use client";

import CardTitle from "@/components/card-title";
import CheckIcon from "@/components/icons/check-icon";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import metadata from "@/data/metadata.json";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import CreateCourseModal from "@/components/common/modals/create-course-modal";
import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import PromptDeleteRecordsModal from "@/components/common/modals/prompt-delete-records-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import Container from "@/components/container";
import AddCourseIcon from "@/components/icons/add-course-icon";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import NoData from "@/components/no-data";
import NotFound from "@/components/not-found";
import Skeleton from "@/components/skeleton";
import { COURSES_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import type { createCourse } from "@/db/client/course";
import {
  deleteAllCourses,
  deleteCourse,
  deleteCourses,
  getCourses,
} from "@/db/client/course";
import useFetchLock from "@/hooks/use-fetch-lock";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types/utils.type";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface Props {
  courses: ResultOf<typeof getCourses>;
}

const Courses: FunctionComponent<Props> = ({ courses: initCourses }) => {
  // State
  const [isEnrollUsersModal, setIsEnrollUsersModal] = useState(false);
  const [isDeleteCourseModal, setIsDeleteCourseModal] = useState(false);
  const [isDeleteCoursesModal, setIsDeleteCoursesModal] = useState(false);
  const [isCreateCourseModal, setIsCreateCourseModal] = useState(false);

  const [courses, setCourses] = useState(initCourses.data);
  const [coursesCount, setCoursesCount] = useState(initCourses.count);

  const [courseId, setCourseId] = useState<string>();
  const [coursesIds, setCoursesIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const coursesOffsetRef = useRef(initCourses.data.length);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

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
      const { data, count } = await getCourses();

      setCourses(data);
      setCoursesCount(count);

      coursesOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCoursesBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const { data, count } = await getCourses(search);

      setCourses(data);
      setCoursesCount(count);

      coursesOffsetRef.current = data.length;
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

      const { data } = await getCourses(searchText, from, to);

      setCourses((prev) => [...prev, ...data]);

      if (isSelectedAll) {
        setCoursesIds((prev) => [...prev, ...data.map(({ id }) => id)]);
      }

      coursesOffsetRef.current += data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteCourse = async () => {
    try {
      await deleteCourse(courseId);

      setCourses((prev) => prev.filter(({ id }) => id !== courseId));
      setCoursesCount((prev) => prev - 1);

      setCoursesIds((_) => _.filter((id) => id !== courseId));

      setIsDeleteCourseModal(false);

      revalidatePageAction();

      coursesOffsetRef.current -= 1;

      toast.success("Success");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitDeleteCourses = async () => {
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

      revalidatePageAction();

      coursesOffsetRef.current -= coursesIds.length;

      toast.success("success");
    } catch (error: any) {
      toast.error(error.message);
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

  const onCreateCourseModalClose = (
    maybeCourse?: ResultOf<typeof createCourse>
  ) => {
    setIsCreateCourseModal(false);

    if (maybeCourse) {
      revalidatePageAction();
      fetchCoursesBySearch(searchText);
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

  // Effects
  useUpdateEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    if (coursesCount) setIsSelectedAll(coursesCount === coursesIds.length);
  }, [coursesCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records
    // This will fit the screen with records
    const fn = throttle(() => {
      if (courses.length && coursesCount !== courses.length) {
        if (
          containerRef.current.scrollHeight ===
          containerRef.current.clientHeight
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
    <Container
      ref={containerRef}
      onScrollEnd={throttleFetch(fetchLock("courses", fetchMoreCourses))}
    >
      <div className="flex flex-col flex-1">
        <p className="text-3xl font-bold text-neutral-600">{t("courses")}</p>
        <p className="text-neutral-500">View and manage courses</p>
        <hr className="my-2 mb-4" />
        <div className="mb-6">
          <div className="flex flex-wrap gap-6">
            <Total
              Icon={<CoursesIcon size="lg" />}
              total={coursesCount}
              title="Total courses"
            />
            {user.role === "Teacher" && (
              <div className="card">
                <AddCourseIcon />
                <hr className="w-full my-3" />
                <button
                  className="primary-button px-8"
                  onClick={() => setIsCreateCourseModal(true)}
                >
                  Create
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div>
            {coursesIds.length ? (
              <div className="mb-3 flex gap-3">
                <button
                  onClick={
                    isSelectedAll ? deselectAllCourses : selectAllCourses
                  }
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
                  Delete <DeleteIcon size="xs" />
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
          </div>
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
                        user.role === "Teacher"
                          ? (checked) => onCourseToggle(checked, id)
                          : undefined
                      }
                    />
                  ),
                  Lessons: lessons[0].count,
                  Members: members[0].count,
                  "": user.role === "Teacher" && (
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
                          <DeleteIcon size="xs" /> Delete
                        </li>
                      </ul>
                    </BasePopper>
                  ),
                })
              )}
            />
          )}
          {isNoData && (
            <NoData
              body={metadata.courses}
              action={
                <button
                  disabled={user.role !== "Teacher"}
                  className="primary-button"
                  onClick={() => setIsCreateCourseModal(true)}
                >
                  Create course
                </button>
              }
            />
          )}
          {isNotFound && (
            <NotFound
              action={
                <button
                  className="outline-button"
                  onClick={() => setSearchText("")}
                >
                  Clear filters
                </button>
              }
            />
          )}

          {isCreateCourseModal && (
            <CreateCourseModal onClose={onCreateCourseModalClose} />
          )}
          {isEnrollUsersModal && (
            <EnrollUsersInCourseModal
              courseId={courseId}
              onClose={onEnrollUsersInCourseModalClose}
            />
          )}
          {isDeleteCourseModal && (
            <PromptDeleteRecordModal
              title={t("modal.titles.delete_course")}
              prompt={`${t("prompts.delete_course")}`}
              confirmText={t("actions.delete")}
              record={courses.find(({ id }) => id === courseId).title}
              onClose={() => setIsDeleteCourseModal(false)}
              onConfirm={submitDeleteCourse}
            />
          )}
          {isDeleteCoursesModal && (
            <PromptDeleteRecordsModal
              title={t("modal.titles.delete_courses")}
              prompt={`${t("prompts.delete_courses", {
                count: coursesIds.length,
              })}`}
              confirmText={t("actions.delete")}
              onConfirm={submitDeleteCourses}
              onClose={() => setIsDeleteCoursesModal(false)}
            />
          )}
        </div>
      </div>
    </Container>
  );
};
export default Courses;
