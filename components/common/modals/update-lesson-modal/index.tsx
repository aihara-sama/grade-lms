"use client";

import DateInput from "@/components/common/inputs/date-input";
import BasicModal from "@/components/common/modals/basic-modal";
import DeleteIcon from "@/components/icons/delete-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import TimeIcon from "@/components/icons/time-icon";
import { addMinutes, millisecondsToMinutes, subMinutes } from "date-fns";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FunctionComponent } from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import BasicInput from "@/components/common/inputs/basic-input";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import BasicSelect from "@/components/common/selects/basic-select";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import LoadingSkeleton from "@/components/utilities/skeletons/loading-skeleton";
import { COURSES_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import { getCourses } from "@/db/client/course";
import { deleteLessons, getLesson, updateLesson } from "@/db/client/lesson";
import { Role } from "@/enums/role.enum";
import { useUser } from "@/hooks/use-user";
import type { SelectItem } from "@/interfaces/select.interface";
import type { Course } from "@/types/course.type";
import type { Lesson } from "@/types/lesson.type";
import type { ResultOf } from "@/types/utils.type";
import { getLessonDuration } from "@/utils/lesson/get-lesson-duration";
import { isLessonOngoing } from "@/utils/lesson/is-lesson-ongoing";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface Props {
  onClose: (maybeLesson?: ResultOf<typeof updateLesson>) => void;
  lessonId: string;
}

const UpdateLessonModal: FunctionComponent<Props> = memo(
  function UpdateLessonModal({ onClose, lessonId }) {
    // State
    const [selectedCourse, setSelectedCourse] = useState<SelectItem>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [lesson, setLesson] = useState<Lesson>();
    const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] =
      useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmittingUpdateLesson, setIsSubmittingUpdateLesson] =
      useState(false);

    // Vars

    // Refs
    const coursesOffsetRef = useRef(COURSES_GET_LIMIT);

    // Hooks
    const t = useTranslations();
    const router = useRouter();
    const user = useUser((state) => state.user);

    // Handlers
    const navigateToPreview = () =>
      router.push(
        `/dashboard/courses/${lesson.course_id}/lessons/${lesson.id}`
      );

    const fetchLesson = async () => {
      setIsLoading(true);

      try {
        setLesson(await getLesson(lessonId));
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCourses = async () => {
      try {
        setCourses((await getCourses()).data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    const fetchCoursesBySearch = useCallback(
      throttleSearch(async (search: string) => {
        try {
          setCourses((await getCourses(search)).data);
        } catch (error: any) {
          toast.error(error.message);
        }
      }, THROTTLE_SEARCH_WAIT),
      []
    );

    const submitUpdateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmittingUpdateLesson(true);
      try {
        onClose(await updateLesson(lesson));

        toast.success(t("success.lesson_updated"));
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsSubmittingUpdateLesson(false);
      }
    };
    const submitDeleteLesson = async () => {
      try {
        await deleteLessons([lesson.id]);

        setIsDeleteLessonModalOpen(false);
        onClose();

        revalidatePageAction();
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    const onChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
      const duration = getLessonDuration(lesson);
      const { value } = e.target;

      if (+value > millisecondsToMinutes(duration)) {
        setLesson((_) => ({
          ..._,
          ends: new Date(addMinutes(_.ends, 15)).toISOString(),
        }));
      } else if (+value < millisecondsToMinutes(duration) && +value > 15) {
        setLesson((_) => ({
          ..._,
          ends: new Date(subMinutes(_.ends, 15)).toISOString(),
        }));
      }
    };
    const onDateChange = (date: Date) => {
      const duration = getLessonDuration(lesson);

      setLesson((_) => ({
        ..._,
        starts: date.toISOString(),
        ends: new Date(+date + duration).toISOString(),
      }));
    };
    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setLesson((_) => ({ ..._, [e.target.name]: e.target.value }));
    };
    const onCourseSelect = (item: SelectItem) => setSelectedCourse(item);

    // Effects
    useEffect(() => {
      fetchLesson();
      fetchCourses();
    }, []);

    useEffect(() => {
      if (lesson && courses.length && !selectedCourse) {
        setSelectedCourse(courses.find(({ id }) => id === lesson.course_id));
      }
    }, [lesson, courses.length]);

    const onCoursesScrollEnd = async (search: string) => {
      const { data } = await getCourses(
        search,
        coursesOffsetRef.current,
        coursesOffsetRef.current + COURSES_GET_LIMIT - 1
      );

      setCourses((prev) => [...prev, ...data]);
      coursesOffsetRef.current += data.length;
    };

    // View
    return (
      <BasicModal
        isFixedHeight={false}
        onClose={() => onClose()}
        title={t("modal.titles.view_lesson.title")}
        headerButtons={
          <>
            <button
              disabled={!lesson}
              className="icon-button"
              onClick={navigateToPreview}
            >
              <LessonsIcon />
            </button>
            {lesson && !isLessonOngoing(lesson) && user.role === "teacher" && (
              <button
                disabled={!lesson}
                className="icon-button"
                onClick={() => setIsDeleteLessonModalOpen(true)}
              >
                <DeleteIcon />
              </button>
            )}
          </>
        }
      >
        {lesson && !isLoading ? (
          <form onSubmit={submitUpdateLesson}>
            {user.role === Role.Teacher && (
              <BasicSelect
                label={t("labels.course")}
                defaultValue={selectedCourse}
                onChange={onCourseSelect}
                options={courses}
                fullWidth
                popperProps={{
                  popperClassName: "h-[198px]",
                }}
                onScrollEnd={onCoursesScrollEnd}
                onSearchInputChange={fetchCoursesBySearch}
              />
            )}
            <BasicInput
              name="title"
              fullWidth
              StartIcon={<LessonsIcon size="xs" />}
              placeholder={t("placeholders.lesson_name")}
              onChange={onInputChange}
              value={lesson.title}
              className="mt-3"
              disabled={user.role !== "teacher"}
            />
            <DateInput
              date={new Date(lesson.starts)}
              onChange={onDateChange}
              label={t("labels.starts_at")}
              disabled={isLessonOngoing(lesson) || user.role !== "teacher"}
            />
            <BasicInput
              fullWidth
              label={`${t("labels.duration")}:`}
              type="number"
              StartIcon={<TimeIcon />}
              value={`${millisecondsToMinutes(getLessonDuration(lesson))}`}
              onChange={onChangeDuration}
              disabled={isLessonOngoing(lesson) || user.role !== "teacher"}
            />
            <hr className="my-3" />
            <div className="flex justify-end">
              {user.role === Role.Teacher ? (
                <button
                  disabled={!lesson.title}
                  type="submit"
                  className="primary-button"
                >
                  {isSubmittingUpdateLesson && <LoadingSpinner />}
                  <span
                    className={`${clsx(isSubmittingUpdateLesson && "opacity-0")}`}
                  >
                    {t("buttons.save")}
                  </span>
                </button>
              ) : (
                <button className="outline-button" onClick={() => onClose()}>
                  {t("buttons.close")}
                </button>
              )}
            </div>
          </form>
        ) : (
          <LoadingSkeleton />
        )}
        {isDeleteLessonModalOpen && (
          <PromptDeleteRecordModal
            onClose={() => setIsDeleteLessonModalOpen(false)}
            title={t("modal.titles.delete_lesson")}
            record={lesson.title}
            confirmText={t("buttons.delete")}
            onConfirm={submitDeleteLesson}
            prompt={t("prompts.delete_lesson")}
          />
        )}
      </BasicModal>
    );
  }
);

export default UpdateLessonModal;
