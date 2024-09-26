"use client";

import CardsContainer from "@/components/cards-container";
import LessonsIcon from "@/components/icons/lessons-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import CreateLesson from "@/components/live-lesson/create-lesson";
import Table from "@/components/table";
import Total from "@/components/total";
import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";

import CardTitle from "@/components/card-title";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import ContentWrapper from "@/components/content-wrapper";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import LessonIcon from "@/components/icons/lesson-icon";
import NoData from "@/components/no-data";
import NotFound from "@/components/not-found";
import Skeleton from "@/components/skeleton";
import { LESSONS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import {
  deleteAllLessonsFromCourse,
  deleteLesson,
  deleteLessons,
  getCourseLessons,
  getCourseLessonsCount,
} from "@/db/lesson";
import { Role } from "@/enums/role.enum";
import useFetchLock from "@/hooks/use-fetch-lock";
import type { Lesson } from "@/types/lesson.type";
import { isLessonOngoing } from "@/utils/lesson/is-lesson-ongoing";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import type { User } from "@supabase/supabase-js";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  user: User;
}
const Lessons: FunctionComponent<Props> = ({ user }) => {
  const [isDelLessonsModalOpen, setIsDelLessonsModalOpen] = useState(false);
  const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);

  const [isSubmittingDelLesson, setIsSubmittingDelLesson] = useState(false);
  const [isSubmittingDelLessons, setIsSubmittingDelLessons] = useState(false);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonId, setLessonId] = useState<string>();
  const [lessonsIds, setLessonsIds] = useState<string[]>([]);

  const [searchText, setSearchText] = useState("");
  const [lessonsCount, setLessonsCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const lessonsOffsetRef = useRef(0);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Hooks
  const t = useTranslations();
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
      const [fetchedLessons, fetchedLessonsCount] = await Promise.all([
        getCourseLessons(courseId),
        getCourseLessonsCount(courseId),
      ]);

      setLessons(fetchedLessons);
      setLessonsCount(fetchedLessonsCount);

      lessonsOffsetRef.current = fetchedLessons.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchLessonsBySearch = async (search: string) => {
    setIsSearching(true);

    try {
      const [fetchedLessons, fetchedLessonsCount] = await Promise.all([
        getCourseLessons(courseId, search),
        getCourseLessonsCount(courseId, search),
      ]);

      setLessons(fetchedLessons);
      setLessonsCount(fetchedLessonsCount);

      lessonsOffsetRef.current = fetchedLessons.length;
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

      const fetchedLessons = await getCourseLessons(
        courseId,
        searchText,
        from,
        to
      );

      setLessons((prev) => [...prev, ...fetchedLessons]);

      if (isSelectedAll) {
        setLessonsIds((prev) => [
          ...prev,
          ...fetchedLessons.map(({ id }) => id),
        ]);
      }

      lessonsOffsetRef.current += fetchedLessons.length;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const submitDeleteLesson = async () => {
    setIsSubmittingDelLesson(true);

    try {
      await deleteLesson(lessonId);

      setLessons((prev) => prev.filter(({ id }) => id !== lessonId));
      setLessonsIds((_) => _.filter((id) => id !== lessonId));
      setLessonsCount((prev) => prev - 1);

      setIsDeleteLessonModalOpen(false);

      toast.success(t("lesson_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDelLesson(false);
    }
  };
  const submitDeleteLessons = async () => {
    setIsSubmittingDelLessons(true);

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
      setIsDelLessonsModalOpen(false);

      toast.success(t("lessons_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDelLessons(false);
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
  useEffect(() => throttledSearch(searchText), [searchText]);

  useEffect(() => {
    if (lessonsCount) setIsSelectedAll(lessonsCount === lessonsIds.length);
  }, [lessonsCount]);

  useEffect(() => {
    // Tall screens may fit more than 20 records
    // This will fit the screen with records
    const fn = throttle(() => {
      if (lessons.length && lessonsCount !== lessons.length) {
        if (
          contentWrapperRef.current.scrollHeight ===
          contentWrapperRef.current.clientHeight
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
    <ContentWrapper
      ref={contentWrapperRef}
      onScrollEnd={throttleFetch(fetchLock("lessons", fetchMoreLessons))}
    >
      <p className="section-title">Lessons</p>
      <CardsContainer>
        <Total
          title="Total lessons"
          total={lessonsCount}
          Icon={<LessonsIcon size="lg" />}
        />
        {user.user_metadata.role === Role.Teacher && (
          <CreateLesson
            onCreated={() => fetchLessonsBySearch(searchText)}
            courseId={courseId}
          />
        )}
      </CardsContainer>
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
            onClick={() => setIsDelLessonsModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
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
                  user.user_metadata.role === Role.Teacher
                    ? (checked) => onLessonToggle(checked, lesson.id)
                    : undefined
                }
              />
            ),
            Starts: format(new Date(lesson.starts), "EEEE, MMM d"),
            "": user.user_metadata.role === Role.Teacher &&
              !isLessonOngoing(lesson) && (
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
                      onClick={() => setIsDeleteLessonModalOpen(true)}
                    >
                      <DeleteIcon /> Delete
                    </li>
                  </ul>
                </BasePopper>
              ),
          }))}
        />
      )}
      {isNoData && <NoData />}
      {isNotFound && <NotFound />}

      {isDelLessonsModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDelLessons}
          onClose={() => setIsDelLessonsModalOpen(false)}
          title="Delete lessons"
          action="Delete"
          body={t("prompts.delete_lessons")}
          actionHandler={submitDeleteLessons}
        />
      )}
      {isDeleteLessonModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDelLesson}
          onClose={() => setIsDeleteLessonModalOpen(false)}
          title="Delete lesson"
          action="Delete"
          body={t("prompts.delete_lesson")}
          actionHandler={submitDeleteLesson}
        />
      )}
    </ContentWrapper>
  );
};

export default Lessons;
