import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { supabaseClient } from "@/utils/supabase/client";
import {
  addDays,
  addMinutes,
  format,
  millisecondsToMinutes,
  setHours,
  setMinutes,
  setSeconds,
  subMinutes,
} from "date-fns";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

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
  const [starts, setStarts] = useState<Date>(
    addDays(setSeconds(setMinutes(setHours(new Date(), 8), 0), 0), 1)
  );
  const [ends, setEnds] = useState<Date>(addMinutes(starts, 30));
  const duration = +new Date(ends) - +new Date(starts);

  const handleChangeDate = (date: Date) => {
    setStarts(date);
    setEnds(addMinutes(date, millisecondsToMinutes(duration)));
  };

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabaseClient.rpc(
      "create_lesson_with_assignments",
      {
        new_course_id: courseId,
        new_title: new FormData(e.currentTarget).get("title") as string,
        new_starts: format(starts, "yyyy-MM-dd'T'HH:mm:ss"),
        new_ends: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
        new_assignments: [],
      }
    );

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
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            name="title"
            bottomSpacing
            Icon={<LessonsIcon size="xs" />}
            placeholder="Lesson name"
            fullWidth
            className="mb-4"
          />
          <DateInput
            date={starts}
            onChange={handleChangeDate}
            useBottomSpacing
            label="Starts at"
          />
          <Input
            label="Duration"
            fullWidth
            type="number"
            Icon={<LessonsIcon />}
            value={`${millisecondsToMinutes(duration)}`}
            onChange={handleChangeDuration}
            className="mt-2"
          />
          <hr className="my-3" />
          <button
            disabled={!lessonName}
            className="primary-button w-full"
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
