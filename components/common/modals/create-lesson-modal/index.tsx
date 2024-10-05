import BaseModal from "@/components/common/modals/base-modal";
import Select from "@/components/common/select";
import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import LoadingSpinner from "@/components/loading-spinner";
import { COURSES_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import { getCourses } from "@/db/client/course";
import { createLesson, getOverlappingLessons } from "@/db/client/lesson";
import type { SelectItem } from "@/interfaces/select.interface";
import type { TablesInsert } from "@/types/supabase.type";
import type { ResultOf } from "@/types/utils.type";
import { getNextMorning } from "@/utils/date/get-next-morning";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import clsx from "clsx";
import { addMinutes, millisecondsToMinutes, subMinutes } from "date-fns";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  courseId?: string;
  onClose: (maybeLesson?: ResultOf<typeof createLesson>) => void;
  maybeLesson?: TablesInsert<"lessons">;
}

const CreateLessonModal: FunctionComponent<Props> = ({
  courseId,
  maybeLesson,
  onClose,
}) => {
  // Hooks
  const t = useTranslations();

  // State
  const [lesson, setLesson] = useState<TablesInsert<"lessons">>({
    title: "",
    starts: getNextMorning().toISOString(),
    ends: addMinutes(getNextMorning(), 30).toISOString(),
    course_id: courseId,
    ...maybeLesson,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<ResultOf<typeof getCourses>["data"]>(
    []
  );
  const [selectedCourse, setSelectedCourse] = useState<SelectItem>();

  const duration = +new Date(lesson.ends) - +new Date(lesson.starts);

  // Refs
  const coursesOffsetRef = useRef(0);

  const changeDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let { ends } = lesson;

    if (+value > millisecondsToMinutes(duration)) {
      ends = addMinutes(ends, 15).toISOString();
    } else if (+value < millisecondsToMinutes(duration) && +value > 15) {
      ends = subMinutes(ends, 15).toISOString();
    }

    setLesson((_) => ({ ..._, ends }));
  };
  const fetchCourses = async () => {
    try {
      const { data } = await getCourses();
      setCourses(data);

      coursesOffsetRef.current += data.length;
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

  const submitCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { count } = await getOverlappingLessons(lesson.starts, lesson.ends);

      if (count) throw new Error(t("error.lesson_overlaps"));

      toast(t("success.lesson_created"));
      onClose(await createLesson(lesson));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const onDateChange = (date: Date) => {
    setLesson((_) => ({
      ..._,
      starts: date.toISOString(),
      ends: addMinutes(date, millisecondsToMinutes(duration)).toISOString(),
    }));
  };
  const onCourseSelect = (item: SelectItem) => setSelectedCourse(item);

  const onCoursesScrollEnd = async (search: string) => {
    const { data } = await getCourses(
      search,
      coursesOffsetRef.current,
      coursesOffsetRef.current + COURSES_GET_LIMIT - 1
    );

    setCourses((prev) => [...prev, ...data]);
    coursesOffsetRef.current += data.length;
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLesson((_) => ({ ..._, [e.target.name]: e.target.value }));

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse)
      setLesson((prev) => ({ ...prev, course_id: selectedCourse.id }));
  }, [selectedCourse]);

  return (
    <BaseModal
      isFixedHeight={false}
      onClose={() => onClose()}
      title="Create lesson"
    >
      <form onSubmit={submitCreateLesson}>
        {!courseId && (
          <Select
            label="Course"
            defaultValue={selectedCourse}
            onChange={onCourseSelect}
            options={courses}
            fullWidth
            popperProps={{
              popperClassName: "h-[198px]",
              className: "mb-3",
            }}
            onScrollEnd={onCoursesScrollEnd}
            onSearchInputChange={fetchCoursesBySearch}
          />
        )}
        <Input
          autoFocus
          fullWidth
          value={lesson.title}
          onChange={onInputChange}
          name="title"
          StartIcon={<LessonsIcon size="xs" />}
          placeholder="Lesson name"
          className="mb-4"
        />
        <DateInput
          date={new Date(lesson.starts)}
          onChange={onDateChange}
          label="Starts at"
        />
        <Input
          fullWidth
          label="Duration"
          type="number"
          StartIcon={<LessonsIcon />}
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
            {isSubmitting && <LoadingSpinner />}
            <span className={`${clsx(isSubmitting && "opacity-0")}`}>
              Create
            </span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
};
export default CreateLessonModal;
