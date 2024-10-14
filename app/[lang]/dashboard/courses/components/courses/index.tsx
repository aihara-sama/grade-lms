"use client";

import TitleCard from "@/components/common/cards/title-card";
import Table from "@/components/common/table";
import Total from "@/components/common/total";
import CheckIcon from "@/components/icons/check-icon";
import CourseIcon from "@/components/icons/course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import SearchIcon from "@/components/icons/search-icon";
import type { FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import BasicInput from "@/components/common/inputs/basic-input";
import CreateCourseModal from "@/components/common/modals/create-course-modal";
import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import PromptDeleteRecordsModal from "@/components/common/modals/prompt-delete-records-modal";
import UpgradeToProModal from "@/components/common/modals/upgrade-to-pro-modal";
import NoData from "@/components/common/no-data";
import NotFound from "@/components/common/not-found";
import BasicPopper from "@/components/common/poppers/basic-popper";
import AddCourseIcon from "@/components/icons/add-course-icon";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import Container from "@/components/layout/container";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { COURSES_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import type { createCourse } from "@/db/client/course";
import {
  deleteAllCourses,
  deleteCourse,
  deleteCourses,
  getCourses,
  getCoursesCount,
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

  const [isUpgradeToProModal, setIsUpgradeToProModal] = useState(false);

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

  const isNotFound = !isLoading && !courses.length && !!searchText.length;

  // Handdlers

  const openCreateCourseModal = async () => {
    const { count } = await getCoursesCount();
    if (user.isPro || count < 3) setIsCreateCourseModal(true);
    else if (count === 3) setIsUpgradeToProModal(true);
  };

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

    if (maybeCourse && maybeCourse.title.includes(searchText)) {
      setCourses((prev) => [...prev, maybeCourse]);
      setCoursesCount((prev) => prev + 1);

      coursesOffsetRef.current += 1;
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
        <p className="text-3xl font-bold text-neutral-600">
          {t("courses.title")}
        </p>
        <p className="text-neutral-500">{t("courses.sub_title")}</p>
        <hr className="my-2 mb-4" />
        <div className="mb-6">
          <div className="flex flex-wrap gap-6">
            <Total
              Icon={<CoursesIcon size="lg" />}
              total={coursesCount}
              title={t("cards.titles.total_courses")}
            />
            {user.role === "teacher" && (
              <div className="card">
                <AddCourseIcon />
                <hr className="w-full my-3" />
                <button
                  className="primary-button px-8"
                  onClick={openCreateCourseModal}
                >
                  {t("buttons.create")}
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
                  {isSelectedAll
                    ? t("buttons.deselect")
                    : t("buttons.select_all")}{" "}
                  <CheckIcon size="xs" />
                </button>
                <button
                  onClick={() => setIsDeleteCoursesModal(true)}
                  className="outline-button flex font-semibold gap-2 items-center"
                >
                  {t("buttons.delete")} <DeleteIcon size="xs" />
                </button>
              </div>
            ) : (
              <BasicInput
                StartIcon={<SearchIcon size="xs" />}
                placeholder={t("placeholders.search")}
                className="w-auto"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
            )}
          </div>
          {isLoading && <LoadingSkeleton />}
          {isData && (
            <Table
              data={courses.map(
                ({ id, title, lessons, users: members }, idx) => ({
                  [t("tables.courses.name")]: (
                    <TitleCard
                      href={`/dashboard/courses/${id}/overview`}
                      checked={coursesIds.includes(id)}
                      Icon={<CourseIcon />}
                      title={title}
                      subtitle={t("courses.active")}
                      onToggle={
                        user.role === "teacher"
                          ? (checked) => onCourseToggle(checked, id)
                          : undefined
                      }
                    />
                  ),
                  [t("tables.courses.lessons")]: lessons[0].count,
                  [t("tables.courses.members")]: members[0].count,
                  "": user.role === "teacher" && (
                    <BasicPopper
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
                          <UsersIcon /> {t("buttons.enroll")}
                        </li>
                        <li
                          className="popper-list-item"
                          onClick={() => setIsDeleteCourseModal(true)}
                        >
                          <DeleteIcon size="xs" /> {t("buttons.delete")}
                        </li>
                      </ul>
                    </BasicPopper>
                  ),
                })
              )}
            />
          )}
          {isNoData && (
            <NoData
              body={t("courses.description")}
              action={
                <button
                  disabled={user.role !== "teacher"}
                  className="primary-button"
                  onClick={() => setIsCreateCourseModal(true)}
                >
                  {t("buttons.create_course")}
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
                  {t("buttons.clear_filters")}
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
              confirmText={t("buttons.delete")}
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
              confirmText={t("buttons.delete")}
              onConfirm={submitDeleteCourses}
              onClose={() => setIsDeleteCoursesModal(false)}
            />
          )}

          {isUpgradeToProModal && (
            <UpgradeToProModal onClose={() => setIsUpgradeToProModal(false)} />
          )}
        </div>
      </div>
    </Container>
  );
};
export default Courses;
