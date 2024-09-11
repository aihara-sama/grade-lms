"use client";

import BaseModal from "@/components/common/modals/base-modal";
import DateInput from "@/components/date-input";
import DeleteIcon from "@/components/icons/delete-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import TimeIcon from "@/components/icons/time-icon";
import Input from "@/components/input";
import { addMinutes, millisecondsToMinutes, subMinutes } from "date-fns";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FunctionComponent } from "react";
import { memo, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import PromptModal from "@/components/common/modals/prompt-modal";
import Select from "@/components/common/select";
import Skeleton from "@/components/skeleton";
import { COURSES_GET_LIMIT } from "@/constants";
import { getCourses } from "@/db/course";
import { deleteLessonsByds, getLessonById, updateLesson } from "@/db/lesson";
import { useUser } from "@/hooks/use-user";
import type { SelectItem } from "@/interfaces/menu.interface";
import { Role } from "@/interfaces/user.interface";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import { getLessonDuration } from "@/utils/get-lesson-duration";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface Props {
  onClose: (mutated?: boolean) => void;
  lessonId: string;
}

const EditLessonModal: FunctionComponent<Props> = memo(
  function EditLessonModal({ onClose, lessonId }) {
    // State
    const [selectedCourse, setSelectedCourse] = useState<SelectItem>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [lesson, setLesson] = useState<Lesson>();
    const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] =
      useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmittingDeleteLesson, setIsSubmittingDeleteLesson] =
      useState(false);
    const [isSubmittingUpdateLesson, setIsSubmittingUpdateLesson] =
      useState(false);

    // Vars

    // Refs
    const coursesOffsetRef = useRef(COURSES_GET_LIMIT);

    // Hooks
    const t = useTranslations();
    const router = useRouter();
    const { user } = useUser();

    // Handlers
    const navigateToPreview = () =>
      router.push(
        `/dashboard/courses/${lesson.course_id}/lessons/${lesson.id}`
      );

    const fetchLesson = async () => {
      setIsLoading(true);

      try {
        setLesson(await getLessonById(lessonId));
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCourses = async () => {
      try {
        setCourses(await getCourses(user.id));
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    const fetchCoursesBySearch = async (search: string) => {
      try {
        setCourses(await getCourses(user.id, search));
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    const submitUpdateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmittingUpdateLesson(true);
      try {
        await updateLesson(lesson);

        toast(t("lesson_updated"));
        onClose(true);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsSubmittingUpdateLesson(false);
      }
    };
    const submitDeleteLesson = async () => {
      setIsSubmittingDeleteLesson(true);
      try {
        await deleteLessonsByds([lesson.id]);

        toast.success("Lesson deleted");
        setIsDeleteLessonModalOpen(false);
        onClose(true);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsSubmittingDeleteLesson(false);
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
      const rangeCourses = await getCourses(
        user.id,
        search,
        coursesOffsetRef.current,
        coursesOffsetRef.current + COURSES_GET_LIMIT - 1
      );

      setCourses((prev) => [...prev, ...rangeCourses]);
      coursesOffsetRef.current += rangeCourses.length;
    };

    // View
    return (
      <BaseModal
        isExpanded={false}
        onClose={() => onClose()}
        title="View lesson"
        headerButtons={
          <>
            <button
              disabled={!lesson}
              className="icon-button"
              onClick={navigateToPreview}
            >
              <LessonsIcon />
            </button>
            {user.role === Role.Teacher && (
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
              <Select
                label="Course"
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
            <Input
              name="title"
              fullWIdth
              Icon={<LessonsIcon size="xs" />}
              placeholder="Lesson name"
              onChange={onInputChange}
              value={lesson.title}
              className="mt-3"
              disabled={user.role !== Role.Teacher}
            />
            <DateInput
              date={new Date(lesson.starts)}
              onChange={onDateChange}
              label="Starts at"
              disabled={user.role !== Role.Teacher}
            />
            <Input
              fullWIdth
              label="Duration:"
              type="number"
              Icon={<TimeIcon />}
              value={`${millisecondsToMinutes(getLessonDuration(lesson))}`}
              onChange={onChangeDuration}
              disabled={user.role !== Role.Teacher}
            />
            <hr className="my-3" />
            <div className="flex justify-end">
              {user.role === Role.Teacher ? (
                <button
                  disabled={!lesson.title}
                  type="submit"
                  className="primary-button"
                >
                  {isSubmittingUpdateLesson && (
                    <img
                      className="loading-spinner"
                      src="/gifs/loading-spinner.gif"
                      alt=""
                    />
                  )}
                  <span
                    className={`${clsx(isSubmittingUpdateLesson && "opacity-0")}`}
                  >
                    Save
                  </span>
                </button>
              ) : (
                <button className="outline-button" onClick={() => onClose()}>
                  Close
                </button>
              )}
            </div>
          </form>
        ) : (
          <Skeleton />
        )}
        {isDeleteLessonModalOpen && (
          <PromptModal
            isSubmitting={isSubmittingDeleteLesson}
            onClose={() => setIsDeleteLessonModalOpen(false)}
            isInsideModal
            title="Delete lesson"
            action="Delete"
            actionHandler={submitDeleteLesson}
            body={t("prompts.delete_lesson")}
          />
        )}
      </BaseModal>
    );
  }
);

export default EditLessonModal;
