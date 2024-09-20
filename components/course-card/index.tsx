import CourseIcon from "@/components/icons/course-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { CourseWithRefsCount } from "@/types/course.type";
import Link from "next/link";
import type { FunctionComponent } from "react";

interface Props {
  course: CourseWithRefsCount;
}

const CourseCard: FunctionComponent<Props> = ({ course }) => {
  return (
    <Link
      href={`/dashboard/courses/${course.id}/overview`}
      key={course.id}
      className="border border-neutral-300 rounded-lg px-4 py-2 flex items-center justify-between min-w-[280px] max-w-[280px] inter-active"
    >
      <div className="flex gap-2 w-full overflow-hidden">
        <CourseIcon size="sm" />
        <div
          className="text-sm flex-1 truncate-fade max-w-40 w-full font-semibold mr-2"
          title={course.title}
        >
          {course.title}
        </div>
      </div>
      <div className="flex gap-3 items-center text-neutral-600">
        <div className="flex flex-col items-center">
          <div>
            <UsersIcon size="xs" />
          </div>
          <div>{course.users[0].count}</div>
        </div>
        <div className="flex flex-col items-center">
          <div>
            <LessonsIcon size="xs" />
          </div>
          <div>{course.lessons[0].count}</div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
