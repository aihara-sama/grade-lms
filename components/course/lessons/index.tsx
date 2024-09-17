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
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import LessonIcon from "@/components/icons/lesson-icon";
import NoDataIcon from "@/components/icons/no-data-icon";
import NotFoundIcon from "@/components/icons/not-found-icon";
import Skeleton from "@/components/skeleton";
import { LESSONS_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import {
  deleteAllLessons,
  deleteLessonById,
  deleteLessonsByds as deleteLessonsByIds,
  getLessonsByCourseId,
  getLessonsCountByCourseId,
} from "@/db/lesson";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { Lesson } from "@/types/lessons.type";
import { isCloseToBottom } from "@/utils/is-document-close-to-bottom";
import { isLessonOngoing } from "@/utils/is-lesson-ongoing";
import { throttleFetch } from "@/utils/throttle-fetch";
import { throttleSearch } from "@/utils/throttle-search";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  courseId: string;
}
const Lessons: FunctionComponent<Props> = ({ courseId }) => {
  const [isDeleteLessonsModalOpen, setIsDeleteLessonsModalOpen] =
    useState(false);
  const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);
  const [selectedLessonsIds, setSelectedLessonsIds] = useState<string[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLessonsCount, setTotalLessonsCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [isSubmittingDeleteLesson, setIsSubmittingDeleteLesson] =
    useState(false);
  const [isSubmittingDeleteLessons, setIsSubmittingDeleteLessons] =
    useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const lessonsOffsetRef = useRef(0);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Vars
  const isData = !!lessons.length && !isLoading;
  const isNoData =
    !isLoading && !isSearching && !totalLessonsCount && !searchText.length;

  const isNotFound =
    !isLoading && !isSearching && !lessons.length && !!searchText.length;

  // Handlers
  const selectAllLessons = () => {
    setSelectedLessonsIds(lessons.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllLessons = () => {
    setSelectedLessonsIds([]);
    setIsSelectedAll(false);
  };

  const fetchInitialLessons = async () => {
    setIsLoading(true);

    try {
      const [fetchedLessons, fetchedLessonsCount] = await Promise.all([
        getLessonsByCourseId(courseId),
        getLessonsCountByCourseId(courseId),
      ]);

      setLessons(fetchedLessons);
      setTotalLessonsCount(fetchedLessonsCount);

      lessonsOffsetRef.current = fetchedLessons.length;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchLessonsBySearch = async (search: string, refetch?: boolean) => {
    setIsSearching(true);

    try {
      const [fetchedLessons, fetchedLessonsCount] = await Promise.all([
        getLessonsByCourseId(courseId, search),
        getLessonsCountByCourseId(courseId, search),
      ]);

      setLessons(fetchedLessons);
      setTotalLessonsCount(fetchedLessonsCount);

      setIsSelectedAll(false);
      setSelectedLessonsIds([]);

      lessonsOffsetRef.current += refetch ? fetchedLessons.length : 0;
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

      const fetchedLessons = await getLessonsByCourseId(
        courseId,
        searchText,
        from,
        to
      );

      setLessons((prev) => [...prev, ...fetchedLessons]);

      if (isSelectedAll) {
        setSelectedLessonsIds((prev) => [
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
    setIsSubmittingDeleteLesson(true);

    try {
      await deleteLessonById(selectedLessonId);

      setIsDeleteLessonModalOpen(false);
      setSelectedLessonsIds((_) => _.filter((id) => id !== selectedLessonId));
      fetchLessonsBySearch(searchText, true);

      toast.success(t("lesson_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteLesson(false);
    }
  };
  const submitDeleteLessons = async () => {
    setIsSubmittingDeleteLessons(true);

    try {
      await (isSelectedAll
        ? deleteAllLessons(courseId, searchText)
        : deleteLessonsByIds(selectedLessonsIds));

      setSelectedLessonsIds([]);
      setIsDeleteLessonsModalOpen(false);
      fetchLessonsBySearch(searchText);

      toast.success(t("lessons_deleted"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteLessons(false);
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

  const onLessonToggle = (checked: boolean, lessonId: string) => {
    if (checked) {
      setSelectedLessonsIds((prev) => [...prev, lessonId]);
      setIsSelectedAll(totalLessonsCount === selectedLessonsIds.length + 1);
    } else {
      setSelectedLessonsIds((prev) => prev.filter((_id) => _id !== lessonId));
      setIsSelectedAll(totalLessonsCount === selectedLessonsIds.length - 1);
    }
  };
  const onLessonsScroll = async (e: Event) => {
    if (isCloseToBottom(e.target as HTMLElement)) {
      fetchMoreLessons();
    }
  };

  // Effects
  useEffect(() => {
    const throttled = throttleFetch(onLessonsScroll);
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
    setIsSelectedAll(totalLessonsCount === selectedLessonsIds.length);
  }, [totalLessonsCount]);
  useEffect(() => {
    // Tall screens may fit more than 20 records. This will fit the screen
    if (lessons.length && totalLessonsCount !== lessons.length) {
      const contentWrapper = document.getElementById("content-wrapper");
      if (contentWrapper.scrollHeight === contentWrapper.clientHeight) {
        fetchMoreLessons();
      }
    }
  }, [lessons, totalLessonsCount]);

  return (
    <>
      <p className="section-title">Lessons</p>
      <CardsContainer>
        <Total
          title="Total lessons"
          total={totalLessonsCount}
          Icon={<LessonsIcon size="lg" />}
        />
        {user.role === Role.Teacher && (
          <CreateLesson
            onCreated={() => fetchLessonsBySearch(searchText, true)}
            courseId={courseId}
          />
        )}
      </CardsContainer>
      {selectedLessonsIds.length ? (
        <div className="mb-3 flex gap-3">
          <button
            onClick={isSelectedAll ? deselectAllLessons : selectAllLessons}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            {isSelectedAll ? totalLessonsCount : selectedLessonsIds.length}{" "}
            {isSelectedAll ? `Deselect` : "Select all"} <CheckIcon size="xs" />
          </button>
          <button
            onClick={() => setIsDeleteLessonsModalOpen(true)}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      ) : (
        <Input
          startIcon={<SearchIcon size="xs" />}
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
                checked={selectedLessonsIds.includes(lesson.id)}
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
                    onClick={() => setSelectedLessonId(lesson.id)}
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

      {isDeleteLessonsModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDeleteLessons}
          onClose={() => setIsDeleteLessonsModalOpen(false)}
          title="Delete lessons"
          action="Delete"
          body={t("prompts.delete_lessons")}
          actionHandler={submitDeleteLessons}
        />
      )}
      {isDeleteLessonModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDeleteLesson}
          onClose={() => setIsDeleteLessonModalOpen(false)}
          title="Delete lesson"
          action="Delete"
          body={t("prompts.delete_lesson")}
          actionHandler={submitDeleteLesson}
        />
      )}
    </>
  );
};

export default Lessons;
