"use client";

import BaseModal from "@/components/common/modals/base-modal";
import DateInput from "@/components/date-input";
import DeleteIcon from "@/components/icons/delete-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import TimeIcon from "@/components/icons/time-icon";
import Input from "@/components/input";
import { db } from "@/utils/supabase/client";
import {
  addMinutes,
  format,
  millisecondsToMinutes,
  subMinutes,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PromptModal from "@/components/common/modals/prompt-modal";
import Select from "@/components/common/select";
import { deleteLessonsByLessonsIds } from "@/db/lesson";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import type {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
} from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  lesson?: Lesson;
  courses: Pick<Course, "id" | "title">[];
  onDone: () => void;
  includeCoursesSelect?: boolean;
  user: User;
}

const EditLessonModal: FunctionComponent<IProps> = ({
  lesson,
  onDone,
  courses,
  isOpen,
  setIsOpen,
  user,
  includeCoursesSelect = false,
}) => {
  // Hooks
  const router = useRouter();

  // State
  const [starts, setStarts] = useState<Date>(new Date());
  const [ends, setEnds] = useState<Date>(new Date());
  const [lessonTitle, setLessonTitle] = useState<string>("");
  const [course, setCourse] = useState<Pick<Course, "id" | "title">>();
  const [isDeleteLessonPromptModalOpen, setIsDeleteLessonPromptModalOpen] =
    useState(false);

  // Vars
  const duration = +new Date(ends) - +new Date(starts);

  // Hooks
  const t = useTranslations();

  // Handlers
  const closeModal = () => setIsOpen(false);
  const openDeleteLessonPromptModal = () =>
    setIsDeleteLessonPromptModalOpen(true);

  const submitUpdateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await db.from("lessons").upsert({
        title: lessonTitle,
        starts: format(starts, "yyyy-MM-dd'T'HH:mm:ss"),
        ends: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
        course_id: course?.id || null,
        id: lesson.id,
      });

      toast(t("lesson_updated"));
      closeModal();
      onDone();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (+value > millisecondsToMinutes(duration)) {
      setEnds(addMinutes(ends, 15));
    } else if (+value < millisecondsToMinutes(duration) && +value > 15) {
      setEnds(subMinutes(ends, 15));
    }
  };
  const deleteLesson = async () => {
    try {
      await deleteLessonsByLessonsIds([lesson.id]);

      toast.success("Lesson deleted");
      onDone();
      closeModal();
      setIsDeleteLessonPromptModalOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Effects
  useEffect(() => {
    if (lesson) {
      setStarts(new Date(lesson.starts));
      setEnds(new Date(lesson.ends));
      setLessonTitle(lesson.title);
      setCourse(courses.find(({ id }) => id === lesson.course_id));
    }
  }, [lesson]);

  // View
  return (
    <BaseModal
      isExpanded={false}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="View lesson"
      headerButtons={
        <>
          {lesson?.course_id && (
            <button
              className="icon-button"
              onClick={() =>
                router.push(
                  `/dashboard/courses/${lesson.course_id}/lessons/${lesson.id}`
                )
              }
            >
              <LessonsIcon />
            </button>
          )}
          {lesson?.id &&
            (user.user_metadata as IUserMetadata).role === Role.Teacher && (
              <button
                className="icon-button"
                onClick={openDeleteLessonPromptModal}
              >
                <DeleteIcon />
              </button>
            )}
        </>
      }
    >
      <div>
        <form onSubmit={submitUpdateLesson} id="create-lesson-form">
          {includeCoursesSelect &&
            (user.user_metadata as IUserMetadata).role === Role.Teacher && (
              <Select
                label="Course"
                defaultValue={course}
                onChange={(item) => setCourse(item)}
                options={courses}
                useUnselect
                fullWidth
                popperProps={{
                  popperClassName: "max-h-[160px]",
                }}
              />
            )}
          <Input
            name="title"
            fullWIdth
            Icon={<LessonsIcon size="xs" />}
            placeholder="Lesson name"
            onChange={(e) => setLessonTitle(e.target.value)}
            value={lessonTitle}
            className="mt-3"
            disabled={
              (user.user_metadata as IUserMetadata).role !== Role.Teacher
            }
          />
        </form>
        <DateInput
          date={starts}
          onChange={(date: Date) => {
            setStarts(date);
            setEnds(new Date(+date + duration));
          }}
          label="Starts at"
          disabled={(user.user_metadata as IUserMetadata).role !== Role.Teacher}
        />
        <Input
          fullWIdth
          label="Duration:"
          type="number"
          Icon={<TimeIcon />}
          value={`${millisecondsToMinutes(duration)}`}
          onChange={handleChangeDuration}
          disabled={(user.user_metadata as IUserMetadata).role !== Role.Teacher}
        />
        <hr className="my-3" />
        <div className="flex justify-end">
          {(user.user_metadata as IUserMetadata).role === Role.Teacher ? (
            <button
              disabled={!lessonTitle}
              type="submit"
              form="create-lesson-form"
              className="primary-button"
            >
              Save
            </button>
          ) : (
            <button className="outline-button" onClick={closeModal}>
              Close
            </button>
          )}
        </div>
      </div>
      <PromptModal
        isInsideModal
        isOpen={isDeleteLessonPromptModalOpen}
        setIsOpen={setIsDeleteLessonPromptModalOpen}
        title="Delete lesson"
        action="Delete"
        actionHandler={deleteLesson}
        body={t("prompts.delete_lesson")}
      />
    </BaseModal>
  );
};

export default EditLessonModal;
