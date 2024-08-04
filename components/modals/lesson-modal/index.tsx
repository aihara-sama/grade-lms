"use client";

import DateInput from "@/components/date-input";
import DeleteIcon from "@/components/icons/delete-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import TimeIcon from "@/components/icons/time-icon";
import Input from "@/components/input";
import Modal from "@/components/modal";
import Select from "@/components/select";
import { supabaseClient } from "@/utils/supabase/client";
import {
  addMinutes,
  format,
  millisecondsToMinutes,
  subMinutes,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import type { Database } from "@/types/supabase.type";
import type { ChangeEvent, FunctionComponent } from "react";

interface IProps {
  lesson: Partial<Database["public"]["Tables"]["lessons"]["Row"]>;
  courses: Pick<
    Database["public"]["Tables"]["courses"]["Row"],
    "id" | "title"
  >[];
  close: () => void;
  onDone: () => void;
  includeCoursesSelect?: boolean;
}

const LessonModal: FunctionComponent<IProps> = ({
  lesson,
  close,
  onDone,
  courses,
  includeCoursesSelect = false,
}) => {
  const router = useRouter();

  const [starts, setStarts] = useState<Date>(new Date(lesson.starts));
  const [ends, setEnds] = useState<Date>(new Date(lesson.ends));
  const [lessonTitle, setLessonTitle] = useState<string>(lesson.title);
  const [courseId, setCourseId] = useState(lesson.course_id);

  const duration = +new Date(ends) - +new Date(starts);

  const handleSaveLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabaseClient.from("lessons").upsert({
      title: lessonTitle,
      starts: format(starts, "yyyy-MM-dd'T'HH:mm:ss"),
      ends: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
      course_id: courseId,
      id: lesson.id,
    });

    if (error) {
      toast(error.message);
    } else {
      toast("Lesson saved");
      onDone();
      close();
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
      close();
    }
  };

  return (
    <Modal
      close={close}
      title={`${lesson.id ? "Edit" : "Create"} lesson`}
      buttons={
        <>
          {lesson.course_id && (
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
          {lesson.id && (
            <button className="icon-button" onClick={deleteLesson}>
              <DeleteIcon />
            </button>
          )}
        </>
      }
      content={
        <div className="">
          <form onSubmit={handleSaveLesson} id="create-lesson-form">
            {includeCoursesSelect && (
              <Select
                fullWidth
                label="Course"
                defaultItemId={courseId}
                onChange={(item) => setCourseId(item.id)}
                items={courses}
                useBottomSpacing
              />
            )}
            <Input
              name="title"
              fullWIdth
              Icon={<LessonsIcon size="xs" />}
              placeholder="Lesson name"
              onChange={(e) => setLessonTitle(e.target.value)}
              value={lessonTitle}
            />
          </form>
          <DateInput
            date={starts}
            onChange={(date: Date) => {
              setStarts(date);
              setEnds(new Date(+date + duration));
            }}
            useBottomSpacing
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
      }
    />
  );
};

export default LessonModal;
