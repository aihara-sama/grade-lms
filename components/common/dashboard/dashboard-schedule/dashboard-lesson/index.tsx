import AssignmentsIcon from "@/components/icons/assignments-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import TimeIcon from "@/components/icons/time-icon";
import type { getDayLessons } from "@/db/client/lesson";
import type { ResultOf } from "@/types/utils.type";
import { isLessonEnded } from "@/utils/lesson/is-lesson-ended";
import { toCapitalCase } from "@/utils/string/to-capital-case";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { FunctionComponent } from "react";

interface Props {
  lesson: ResultOf<typeof getDayLessons>["data"][number];
}

const DashboardLesson: FunctionComponent<Props> = ({ lesson }) => {
  // Handlers
  const getLessonStatus = () => {
    if (isLessonEnded(lesson)) return "Ended";

    return toCapitalCase(
      formatDistanceToNow(new Date(lesson.ends), {
        addSuffix: true,
      })
    );
  };
  const getWidgetStyle = (date: Date) => {
    let classes = "rounded-xl py-[2px] px-[8px] font-bold border-2 text-sm";

    if (+date < +new Date()) {
      classes += " text-rose-600 border-rose-600";
    } else {
      classes += " text-green-600 border-green-600";
    }
    return classes;
  };

  // View
  return (
    <div>
      <div className="flex justify-between items-center">
        <div
          title={lesson.course.title}
          className="w-full text-base text-neutral-500 truncate-fade max-w-[140px]"
        >
          {lesson.course.title}
        </div>
        <div className={getWidgetStyle(new Date(lesson.ends))}>
          {getLessonStatus()}
        </div>
      </div>
      <div
        title={lesson.title}
        className="w-full text-base font-bold truncate-fade"
      >
        {lesson.title}
      </div>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <TimeIcon />
        {format(lesson.starts, "h:mm a")}
      </div>
      <div className="mb-4 flex gap-3">
        <Link
          href={`/dashboard/courses/${lesson.course_id}/lessons/${lesson.id}/assignments`}
          className="flex items-center gap-2 border border-gray-200 py-[6px] px-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 hover:text-primary"
        >
          <AssignmentsIcon size="xs" />
          Assignments
        </Link>
        <Link
          href={`/dashboard/courses/${lesson.course_id}/lessons/${lesson.id}/overview`}
          className="flex p-3 border border-gray-200 rounded-lg hover:bg-gray-100 active:bg-gray-200 hover:text-primary"
        >
          <LessonsIcon size="xs" />
        </Link>
      </div>
      <hr />
    </div>
  );
};

export default DashboardLesson;
