"use client";

import LessonsIcon from "@/components/icons/lessons-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import Table from "@/components/table";
import Total from "@/components/total";
import metadata from "@/data/metadata.json";
import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import CardTitle from "@/components/card-title";
import CreateLessonModal from "@/components/common/modals/create-lesson-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import PromptDeleteRecordsModal from "@/components/common/modals/prompt-delete-records-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import Container from "@/components/container";
import CourseHeader from "@/components/course/course-header";
import CreateLessonIcon from "@/components/icons/add-lesson-icon";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import LessonIcon from "@/components/icons/lesson-icon";
import NoData from "@/components/no-data";
import NotFound from "@/components/not-found";
import Skeleton from "@/components/skeleton";
import { LESSONS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import type { createLesson } from "@/db/client/lesson";
import {
  deleteAllLessonsFromCourse,
  deleteLesson,
  deleteLessons,
  getCourseLessons,
} from "@/db/client/lesson";
import type { getCourse } from "@/db/server/course";
import { Role } from "@/enums/role.enum";
import useFetchLock from "@/hooks/use-fetch-lock";
import { useUpdateEffect } from "@/hooks/use-update-effect";
import { useUser } from "@/hooks/use-user";
import type { ResultOf } from "@/types/utils.type";
import { isLessonOngoing } from "@/utils/lesson/is-lesson-ongoing";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  course: ResultOf<typeof getCourse>;
  lessons: ResultOf<typeof getCourseLessons>;
}

const Lessons: FunctionComponent<Props> = ({
  course,
  lessons: initLessons,
}) => {
  const [isCreateLessonModal, setIsCreateLessonModal] = useState(false);
  const [isDelLessonsModal, setIsDelLessonsModal] = useState(false);
  const [isDeleteLessonModal, setIsDeleteLessonModal] = useState(false);

  const [lessons, setLessons] = useState(initLessons.data);
  const [lessonId, setLessonId] = useState<string>();
  const [lessonsIds, setLessonsIds] = useState<string[]>([]);

  const [searchText, setSearchText] = useState("");
  const [lessonsCount, setLessonsCount] = useState(initLessons.count);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const lessonsOffsetRef = useRef(initLessons.data.length);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);
  const { courseId } = useParams<{ courseId: string }>();

  const fetchLock = useFetchLock();

  // Vars
  const isData = !!lessons.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !lessonsCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !lessons.length && !!searchText.length;

  // Handlers
  const selectAllLessons = () => {
    setLessonsIds(lessons.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllLessons = () => {
    setLessonsIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialLessons = async () => {
    setIsLoading(true);

    try {
      const { data, count } = await getCourseLessons(courseId);

      setLessons(data);
      setLessonsCount(count);

      lessonsOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchLessonsBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const { data, count } = await getCourseLessons(courseId, search);

      setLessons(data);
      setLessonsCount(count);

      lessonsOffsetRef.current = data.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSearching(false);
    }
  };
  const fetchMoreLessons = async () => {
    try {
      const from = lessonsOffsetRef.current;
      const to = lessonsOffsetRef.current + LESSONS_GET_LIMIT - 1;

      const { data } = await getCourseLessons(courseId, searchText, from, to);

      setLessons((prev) => [...prev, ...data]);

      if (isSelectedAll) {
        setLessonsIds((prev) => [...prev, ...data.map(({ id }) => id)]);
      }

      lessonsOffsetRef.current += data.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteLesson = async () => {
    try {
      await deleteLesson(lessonId);

      setLessons((prev) => prev.filter(({ id }) => id !== lessonId));
      setLessonsIds((_) => _.filter((id) => id !== lessonId));
      setLessonsCount((prev) => prev - 1);

      setIsDeleteLessonModal(false);

      revalidatePageAction();

      lessonsOffsetRef.current -= 1;

      toast.success(t("success.lesson_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitDeleteLessons = async () => {
    try {
      if (isSelectedAll) {
        await deleteAllLessonsFromCourse(courseId, searchText);
        setLessons([]);
        setLessonsCount(0);
      } else {
        await deleteLessons(lessonsIds);
        setLessons((prev) => prev.filter(({ id }) => !lessonsIds.includes(id)));
        setLessonsCount((prev) => prev - lessonsIds.length);
      }

      setLessonsIds([]);
      setIsDelLessonsModal(false);

      revalidatePageAction();

      lessonsOffsetRef.current -= lessonsIds.length;

      toast.success(t("success.lessons_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onLessonToggle = (checked: boolean, _lessonId: string) => {
    if (checked) {
      setLessonsIds((prev) => [...prev, _lessonId]);
      setIsSelectedAll(lessonsCount === lessonsIds.length + 1);
    } else {
      setLessonsIds((prev) => prev.filter((_id) => _id !== _lessonId));
      setIsSelectedAll(lessonsCount === lessonsIds.length - 1);
    }
  };
  const onCreateLessonModalClose = (
    maybeLesson?: ResultOf<typeof createLesson>
  ) => {
    setIsCreateLessonModal(false);

    if (maybeLesson) {
      revalidatePageAction();
      fetchLessonsBySearch(searchText);
    }
  };

  const throttledSearch = useCallback(
    throttleSearch((search) => {
      if (search) {
        fetchLessonsBySearch(search);
      } else {
        fetchInitialLessons();
      }
    }, THROTTLE_SEARCH_WAIT),
    []
  );

  // Effects
  useUpdateEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    if (lessonsCount) setIsSelectedAll(lessonsCount === lessonsIds.length);
  }, [lessonsCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records
    // This will fit the screen with records
    const fn = throttle(() => {
      if (lessons.length && lessonsCount !== lessons.length) {
        if (
          containerRef.current.scrollHeight ===
          containerRef.current.clientHeight
        ) {
          fetchLock("lessons", fetchMoreLessons)();
        }
      }
    }, 300);
    fn();

    window.addEventListener("resize", fn);

    return () => {
      window.removeEventListener("resize", fn);
    };
  }, [lessons, lessonsCount]);
  return (
    <Container
      ref={containerRef}
      onScrollEnd={throttleFetch(fetchLock("lessons", fetchMoreLessons))}
    >
      <CourseHeader course={course} />
      <p className="section-title">Lessons</p>

      <div className="mb-6">
        <div className="flex flex-wrap gap-6">
          <Total
            title="Total lessons"
            total={lessonsCount}
            Icon={<LessonsIcon size="lg" />}
          />
          {user.role === Role.Teacher && (
            <div className="card">
              <CreateLessonIcon size="lg" />
              <hr className="w-full my-3" />
              <button
                className="primary-button px-8"
                onClick={() => setIsCreateLessonModal(true)}
              >
                Create
              </button>
            </div>
          )}
        </div>
      </div>
      {lessonsIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={isSelectedAll ? deselectAllLessons : selectAllLessons}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? lessonsCount : lessonsIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsDelLessonsModal(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon size="xs" />
          </button>
        </div>
      ) : (
        <Input
          StartIcon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      )}

      {isLoading && <Skeleton />}
      {isData && (
        <Table
          data={lessons.map((lesson, idx) => ({
            Name: (
              <CardTitle
                href={`/dashboard/courses/${courseId}/lessons/${lesson.id}/overview`}
                checked={lessonsIds.includes(lesson.id)}
                Icon={<LessonIcon size="md" />}
                title={lesson.title}
                subtitle=""
                onToggle={
                  user.role === Role.Teacher
                    ? (checked) => onLessonToggle(checked, lesson.id)
                    : undefined
                }
              />
            ),
            Starts: format(new Date(lesson.starts), "EEEE, MMM d"),
            "": user.role === Role.Teacher && !isLessonOngoing(lesson) && (
              <BasePopper
                placement={
                  lessons.length > 7 && lessons.length - idx < 4
                    ? "top"
                    : "bottom"
                }
                width="sm"
                trigger={
                  <button
                    className="icon-button text-neutral-500"
                    onClick={() => setLessonId(lesson.id)}
                  >
                    <DotsIcon />
                  </button>
                }
              >
                <ul className="flex flex-col">
                  <li
                    className="popper-list-item"
                    onClick={() => setIsDeleteLessonModal(true)}
                  >
                    <DeleteIcon size="xs" /> Delete
                  </li>
                </ul>
              </BasePopper>
            ),
          }))}
        />
      )}
      {isNoData && (
        <NoData
          body={metadata.lessons}
          action={
            <button
              className="primary-button"
              disabled={user.role !== "Teacher"}
              onClick={() => setIsCreateLessonModal(true)}
            >
              Create lesson
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

      {isCreateLessonModal && (
        <CreateLessonModal
          onClose={onCreateLessonModalClose}
          courseId={courseId}
        />
      )}

      {isDeleteLessonModal && (
        <PromptDeleteRecordModal
          title={t("modal.titles.delete_lesson")}
          prompt={`${t("prompts.delete_lesson")}`}
          record={lessons.find(({ id }) => id === lessonId).title}
          confirmText={t("actions.delete")}
          onClose={() => setIsDeleteLessonModal(false)}
          onConfirm={submitDeleteLesson}
        />
      )}
      {isDelLessonsModal && (
        <PromptDeleteRecordsModal
          title={t("modal.titles.delete_lessons")}
          prompt={`${t("prompts.delete_lessons", {
            count: lessonsIds.length,
          })}`}
          confirmText={t("actions.delete")}
          onClose={() => setIsDelLessonsModal(false)}
          onConfirm={submitDeleteLessons}
        />
      )}
    </Container>
  );
};

export default Lessons;
