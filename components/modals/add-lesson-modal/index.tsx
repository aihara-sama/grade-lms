import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { supabaseClient } from "@/utils/supabase/client";
import {
  addMinutes,
  format,
  millisecondsToMinutes,
  subMinutes,
} from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

import { getNextMorning } from "@/utils/get-next-morning";
import type { ChangeEvent, FunctionComponent } from "react";

interface IProps {
  courseId: string;
  closeModal: () => void;
  onDone: () => void;
}

const AddLessonModal: FunctionComponent<IProps> = ({
  courseId,
  closeModal,
  onDone,
}) => {
  const [lessonName, setLessonName] = useState("");
  const [starts, setStarts] = useState<Date>(getNextMorning());
  const [ends, setEnds] = useState<Date>(addMinutes(starts, 30));
  const duration = +new Date(ends) - +new Date(starts);

  const handleChangeDate = (date: Date) => {
    setStarts(date);
    setEnds(addMinutes(date, millisecondsToMinutes(duration)));
  };

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabaseClient.from("lessons").insert({
      course_id: courseId,
      title: new FormData(e.currentTarget).get("title") as string,
      starts: format(starts, "yyyy-MM-dd'T'HH:mm:ss"),
      ends: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
    });

    if (error) {
      toast(error.message);
    } else {
      toast("Course created");
      onDone();
      closeModal();
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

  return (
    <Modal
      close={closeModal}
      title="Create lesson"
      content={
        <form onSubmit={handleCreateLesson}>
          <Input
            fullWIdth
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            name="title"
            Icon={<LessonsIcon size="xs" />}
            placeholder="Lesson name"
            className="mb-4"
          />
          <DateInput
            date={starts}
            onChange={handleChangeDate}
            label="Starts at"
          />
          <Input
            fullWIdth
            label="Duration"
            type="number"
            Icon={<LessonsIcon />}
            value={`${millisecondsToMinutes(duration)}`}
            onChange={handleChangeDuration}
            className="mt-2"
          />
          <hr className="my-3" />
          <button
            disabled={!lessonName}
            className="primary-button"
            type="submit"
          >
            Create
          </button>
        </form>
      }
    />
  );
};

export default AddLessonModal;
