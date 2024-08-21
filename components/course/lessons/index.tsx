"use client";

import CardsContainer from "@/components/cards-container";
import LessonsIcon from "@/components/icons/lessons-icon";
import SearchIcon from "@/components/icons/search-icon";
import Input from "@/components/input";
import CreateLesson from "@/components/live-lesson/create-lesson";
import Table from "@/components/table";
import Total from "@/components/total";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

import CardTitle from "@/components/card-title";
import PromptModal from "@/components/common/modals/prompt-modal";
import LessonOptionsPopper from "@/components/common/poppers/lesson-options-popper";
import CheckIcon from "@/components/icons/check-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import Skeleton from "@/components/skeleton";
import { LESSONS_GET_LIMIT } from "@/constants";
import {
  deleteLessonsByLessonsIds,
  deleteLessonsByTitleAndCourseId,
  getLessonsByCourseId,
  getLessonsByTitleAndCourseId,
  getLessonsCountByCourseId,
  getLessonsCountByTitleAndCourseId,
  getOffsetLessonsByTitleAndCourseId,
} from "@/db/lesson";
import type { Lesson } from "@/types/lessons.type";
import { isDocCloseToBottom } from "@/utils/is-document-close-to-bottom";
import throttle from "lodash.throttle";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  courseId: string;
}
const Lessons: FunctionComponent<IProps> = ({ courseId }) => {
  const [isDeleteLessonsModalOpen, setIsDeleteLessonsModalOpen] =
    useState(false);
  const [selectedLessonsIds, setSelectedLessonsIds] = useState<string[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLessonsLoading, setIsLessonsLoading] = useState(true);
  const [totalLessonsCount, setTotalLessonsCount] = useState(0);
  const [lessonsSearchText, setLessonsSearchText] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Refs
  const isSelectedAllRef = useRef(false);
  const lessonsSearchTextRef = useRef("");
  const lessonsOffsetRef = useRef(LESSONS_GET_LIMIT);

  // Hooks
  const t = useTranslations();

  const openDeleteLessonsModal = () => setIsDeleteLessonsModalOpen(true);
  const onLessonToggle = (checked: boolean, lessonId: string) => {
    if (checked) {
      setSelectedLessonsIds((prev) => [...prev, lessonId]);
      setIsSelectedAll(totalLessonsCount === selectedLessonsIds.length + 1);
    } else {
      setSelectedLessonsIds((prev) => prev.filter((_id) => _id !== lessonId));
      setIsSelectedAll(totalLessonsCount === selectedLessonsIds.length - 1);
    }
  };
  const fetchLessonsWithCount = async () => {
    setIsLessonsLoading(true);

    try {
      const [lessonsByCourseId, lessonsCountByCourseId] = await Promise.all([
        getLessonsByCourseId(courseId),
        getLessonsCountByCourseId(courseId),
      ]);

      setLessons(lessonsByCourseId);
      setTotalLessonsCount(lessonsCountByCourseId);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLessonsLoading(false);
    }
  };

  const selectAllLessons = () => {
    setSelectedLessonsIds(lessons.map(({ id }) => id));
    setIsSelectedAll(true);
  };
  const deselectAllLessons = () => {
    setSelectedLessonsIds([]);
    setIsSelectedAll(false);
  };

  const fetchLessonsBySearch = async () => {
    try {
      const [lessonsByTitleAndCourseId, lessonsCountByTitCoursedUserId] =
        await Promise.all([
          getLessonsByTitleAndCourseId(lessonsSearchTextRef.current, courseId),
          getLessonsCountByTitleAndCourseId(
            lessonsSearchTextRef.current,
            courseId
          ),
        ]);

      setLessons(lessonsByTitleAndCourseId);
      setTotalLessonsCount(lessonsCountByTitCoursedUserId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLessonsSearchText((lessonsSearchTextRef.current = e.target.value));
    fetchLessonsBySearch();
  };
  const handleLessonsScroll = async () => {
    if (isDocCloseToBottom()) {
      try {
        const offsetlessonsByUserId = await getOffsetLessonsByTitleAndCourseId(
          courseId,
          lessonsSearchTextRef.current,
          lessonsOffsetRef.current,
          lessonsOffsetRef.current + LESSONS_GET_LIMIT - 1
        );

        setLessons((prev) => [...prev, ...offsetlessonsByUserId]);

        if (isSelectedAllRef.current) {
          setSelectedLessonsIds((prev) => [
            ...prev,
            ...offsetlessonsByUserId.map(({ id }) => id),
          ]);
        }

        lessonsOffsetRef.current += offsetlessonsByUserId.length;
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const deleteSelectedLessons = async () => {
    try {
      await (isSelectedAllRef.current
        ? deleteLessonsByTitleAndCourseId(lessonsSearchText, courseId)
        : deleteLessonsByLessonsIds(selectedLessonsIds));

      setSelectedLessonsIds([]);
      setIsDeleteLessonsModalOpen(false);
      fetchLessonsBySearch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Effects
  useEffect(() => {
    const throttled = throttle(handleLessonsScroll, 300);
    document.addEventListener("scroll", throttled);

    return () => {
      document.removeEventListener("scroll", throttled);
    };
  }, []);
  useEffect(() => {
    fetchLessonsWithCount();
  }, []);
  useEffect(() => {
    setIsSelectedAll(totalLessonsCount === selectedLessonsIds.length);
  }, [totalLessonsCount]);
  useEffect(() => {
    lessonsSearchTextRef.current = lessonsSearchText;
  }, [lessonsSearchText]);
  useEffect(() => {
    isSelectedAllRef.current = isSelectedAll;
  }, [isSelectedAll]);

  return (
    <>
      <p className="section-title">Lessons</p>
      <CardsContainer>
        <Total
          title="Total lessons"
          total={totalLessonsCount}
          Icon={<LessonsIcon size="lg" />}
        />
        <CreateLesson onDone={fetchLessonsBySearch} courseId={courseId} />
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
            onClick={openDeleteLessonsModal}
            className="outline-button flex font-semibold gap-2 items-center"
          >
            Delete <DeleteIcon />
          </button>
        </div>
      ) : (
        <Input
          Icon={<SearchIcon size="xs" />}
          placeholder="Search"
          className="w-auto"
          onChange={handleSearchInputChange}
          value={lessonsSearchText}
        />
      )}
      {isLessonsLoading ? (
        <Skeleton />
      ) : (
        <Table
          data={lessons.map(({ id, title, starts }) => ({
            Name: (
              <CardTitle
                href={`/dashboard/courses/${courseId}/lessons/${id}/overview`}
                checked={selectedLessonsIds.includes(id)}
                Icon={<LessonsIcon size="md" />}
                title={title}
                subtitle=""
                onClick={() => {}}
                onToggle={(checked) => onLessonToggle(checked, id)}
              />
            ),
            Starts: format(new Date(starts), "EEEE, MMM d"),
            "": (
              <LessonOptionsPopper
                lessonId={id}
                onDone={fetchLessonsBySearch}
                setSelectedLessonsIds={setSelectedLessonsIds}
              />
            ),
          }))}
        />
      )}
      <PromptModal
        setIsOpen={setIsDeleteLessonsModalOpen}
        isOpen={isDeleteLessonsModalOpen}
        title="Delete lessons"
        action="Delete"
        body={t("prompts.delete_lessons")}
        actionHandler={deleteSelectedLessons}
      />
    </>
  );
};

export default Lessons;
