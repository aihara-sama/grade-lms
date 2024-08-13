"use client";

import BaseModal from "@/components/common/modals/base-modal";
import DateInput from "@/components/date-input";
import DeleteIcon from "@/components/icons/delete-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import TimeIcon from "@/components/icons/time-icon";
import Input from "@/components/input";
import { supabaseClient } from "@/utils/supabase/client";
import {
  addMinutes,
  format,
  millisecondsToMinutes,
  subMinutes,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Select from "@/components/common/select";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
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
}

const EditLessonModal: FunctionComponent<IProps> = ({
  lesson,
  onDone,
  courses,
  isOpen,
  setIsOpen,
  includeCoursesSelect = false,
}) => {
  // Hooks
  const router = useRouter();

  // State
  const [starts, setStarts] = useState<Date>(new Date());
  const [ends, setEnds] = useState<Date>(new Date());
  const [lessonTitle, setLessonTitle] = useState<string>("");
  const [course, setCourse] = useState<Pick<Course, "id" | "title">>();

  // Vars
  const duration = +new Date(ends) - +new Date(starts);

  // Handlers
  const handleSaveLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabaseClient
      .from("lessons")
      .update({
        title: lessonTitle,
        starts: format(starts, "yyyy-MM-dd'T'HH:mm:ss"),
        ends: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
        course_id: course?.id || null,
      })
      .eq("id", lesson.id);

    if (error) {
      toast(error.message);
    } else {
      toast("Lesson saved");
      onDone();
      setIsOpen(false);
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
    const { error } = await supabaseClient
      .from("lessons")
      .delete()
      .eq("id", lesson.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Lesson deleted");
      onDone();
      setIsOpen(false);
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
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      header="Edit lesson"
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
          {lesson?.id && (
            <button className="icon-button" onClick={deleteLesson}>
              <DeleteIcon />
            </button>
          )}
        </>
      }
    >
      <div>
        <form onSubmit={handleSaveLesson} id="create-lesson-form">
          {includeCoursesSelect && (
            <Select
              label="Course"
              defaultValue={course}
              onChange={(item) => setCourse(item)}
              options={courses}
              useUnselect
              fullWidth
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
          />
        </form>
        <DateInput
          date={starts}
          onChange={(date: Date) => {
            setStarts(date);
            setEnds(new Date(+date + duration));
          }}
          label="Starts at"
        />
        <Input
          fullWIdth
          label="Duration:"
          type="number"
          Icon={<TimeIcon />}
          value={`${millisecondsToMinutes(duration)}`}
          onChange={handleChangeDuration}
        />
        <hr className="my-3" />
        <button
          disabled={!lessonTitle}
          type="submit"
          form="create-lesson-form"
          className="primary-button"
        >
          Save
        </button>
      </div>
    </BaseModal>
  );
};

export default EditLessonModal;
