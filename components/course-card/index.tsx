import CourseIcon from "@/components/icons/course-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import UsersIcon from "@/components/icons/users-icon";
import type { CourseWithRefsCount } from "@/types/courses.type";
import Link from "next/link";
import type { FunctionComponent } from "react";

interface IProps {
  course: CourseWithRefsCount;
}

const CourseCard: FunctionComponent<IProps> = ({ course }) => {
  return (
    <Link
      href={`/dashboard/courses/${course.id}/overview`}
      key={course.id}
      className="border border-neutral-300 rounded-lg px-4 py-2 flex items-center justify-between min-w-[220px] interactive"
    >
      <div className="flex gap-2 w-full">
        <CourseIcon size="sm" />
        <div
          className="text-sm flex-1 truncate-fade max-w-[105px] w-full font-semibold"
          title={course.title}
        >
          {course.title}
        </div>
      </div>
      <div className="flex gap-3 items-center text-neutral-600">
        <div>
          <div>
            <UsersIcon size="xs" />
          </div>
          <div>{course.users[0].count}</div>
        </div>
        <div>
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