import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import {
  addMinutes,
  format,
  millisecondsToMinutes,
  subMinutes,
} from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import BaseModal from "@/components/common/modals/base-modal";
import { insertLesson } from "@/db/lesson";
import type { TablesInsert } from "@/types/supabase.type";
import { getNextMorning } from "@/utils/get-next-morning";
import { useTranslations } from "next-intl";
import type {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
} from "react";

const initLesson: TablesInsert<"lessons"> = {
  title: "",
  starts: format(getNextMorning(), "yyyy-MM-dd'T'HH:mm:ss"),
  ends: format(addMinutes(getNextMorning(), 30), "yyyy-MM-dd'T'HH:mm:ss"),
};

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDone: () => void;
  courseId: string;
}

const CreateLessonModal: FunctionComponent<IProps> = ({
  onDone,
  isOpen,
  setIsOpen,
  courseId,
}) => {
  const [lesson, setLesson] = useState<TablesInsert<"lessons">>({
    ...initLesson,
    course_id: courseId,
  });
  const duration = +new Date(lesson.ends) - +new Date(lesson.starts);

  // Hooks
  const t = useTranslations();

  const handleChangeDate = (date: Date) => {
    setLesson((_) => ({
      ..._,
      starts: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
      ends: format(
        addMinutes(date, millisecondsToMinutes(duration)),
        "yyyy-MM-dd'T'HH:mm:ss"
      ),
    }));
  };

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await insertLesson(lesson);

      toast(t("lesson_created"));
      setIsOpen(false);
      onDone();
      setLesson(initLesson);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let ends: string;

    if (+value > millisecondsToMinutes(duration)) {
      ends = format(addMinutes(ends, 15), "yyyy-MM-dd'T'HH:mm:ss");
    } else if (+value < millisecondsToMinutes(duration) && +value > 15) {
      ends = format(subMinutes(ends, 15), "yyyy-MM-dd'T'HH:mm:ss");
    }

    setLesson((_) => ({ ..._, ends }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLesson((_) => ({ ..._, [e.target.name]: e.target.value }));

  useEffect(() => {
    if (!isOpen) setLesson({ ...initLesson, course_id: courseId });
  }, [isOpen]);

  return (
    <BaseModal
      isExpanded={false}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      title="Create lesson"
    >
      <form onSubmit={handleCreateLesson}>
        <Input
          autoFocus
          fullWIdth
          value={lesson.title}
          onChange={handleInputChange}
          name="title"
          Icon={<LessonsIcon size="xs" />}
          placeholder="Lesson name"
          className="mb-4"
        />
        <DateInput
          date={new Date(lesson.starts)}
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
        <div className="flex justify-end">
          <button
            disabled={!lesson.title}
            className="primary-button"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </BaseModal>
  );
};
export default CreateLessonModal;
