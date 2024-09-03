import BaseModal from "@/components/common/modals/base-modal";
import Select from "@/components/common/select";
import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import { getCoursesByUserId } from "@/db/course";
import { createLesson, getOverlappingLessons } from "@/db/lesson";
import { useUser } from "@/hooks/use-user";
import type { SelectItem } from "@/interfaces/menu.interface";
import type { Course } from "@/types/courses.type";
import type { TablesInsert } from "@/types/supabase.type";
import { getNextMorning } from "@/utils/get-next-morning";
import {
  addMinutes,
  format,
  millisecondsToMinutes,
  subMinutes,
} from "date-fns";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  courseId?: string;
  onClose: (mutated?: boolean) => void;
  maybeLesson?: TablesInsert<"lessons">;
}

const CreateLessonModal: FunctionComponent<Props> = memo(
  function CreateLessonModal({ courseId, maybeLesson, onClose }) {
    const [lesson, setLesson] = useState<TablesInsert<"lessons">>({
      title: "",
      starts: getNextMorning().toISOString(),
      ends: addMinutes(getNextMorning(), 30).toISOString(),
      ...maybeLesson,
      course_id: courseId,
    });

    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<SelectItem>();

    const duration = +new Date(lesson.ends) - +new Date(lesson.starts);

    // Hooks
    const t = useTranslations();
    const { user } = useUser();

    const changeDuration = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      let { ends } = lesson;

      if (+value > millisecondsToMinutes(duration)) {
        ends = format(addMinutes(ends, 15), "yyyy-MM-dd'T'HH:mm:ss");
      } else if (+value < millisecondsToMinutes(duration) && +value > 15) {
        ends = format(subMinutes(ends, 15), "yyyy-MM-dd'T'HH:mm:ss");
      }

      setLesson((_) => ({ ..._, ends }));
    };
    const fetchCourses = async () => {
      try {
        setCourses(await getCoursesByUserId(user.id));
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    const submitCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const overlappingLesson = await getOverlappingLessons(
          lesson.starts,
          lesson.ends,
          user.id
        );

        if (overlappingLesson.length) throw new Error(t("lesson_overlaps"));

        await createLesson(lesson);

        toast(t("lesson_created"));
        onClose(true);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    const onDateChange = (date: Date) => {
      setLesson((_) => ({
        ..._,
        starts: date.toISOString(),
        ends: new Date(
          addMinutes(date, millisecondsToMinutes(duration))
        ).toISOString(),
      }));
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
      setLesson((_) => ({ ..._, [e.target.name]: e.target.value }));
    const onCourseSelect = (item: SelectItem) => setSelectedCourse(item);

    useEffect(() => {
      fetchCourses();
    }, []);

    useEffect(() => {
      if (selectedCourse)
        setLesson((_) => ({ ..._, course_id: selectedCourse.id }));
    }, [selectedCourse]);
    return (
      <BaseModal isExpanded={false} onClose={onClose} title="Create lesson">
        <form onSubmit={submitCreateLesson}>
          {!courseId && (
            <Select
              label="Course"
              defaultValue={selectedCourse}
              onChange={onCourseSelect}
              options={courses}
              fullWidth
              popperProps={{
                popperClassName: "h-[198px] ",
                className: "mb-3",
              }}
            />
          )}
          <Input
            autoFocus
            fullWIdth
            value={lesson.title}
            onChange={onInputChange}
            name="title"
            Icon={<LessonsIcon size="xs" />}
            placeholder="Lesson name"
            className="mb-4"
          />
          <DateInput
            date={new Date(lesson.starts)}
            onChange={onDateChange}
            label="Starts at"
          />
          <Input
            fullWIdth
            label="Duration"
            type="number"
            Icon={<LessonsIcon />}
            value={`${millisecondsToMinutes(duration)}`}
            onChange={changeDuration}
            className="mt-2"
          />
          <hr className="my-3" />
          <div className="flex justify-end">
            <button
              disabled={!(lesson.title && lesson.course_id)}
              className="primary-button"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </BaseModal>
    );
  }
);
export default CreateLessonModal;
