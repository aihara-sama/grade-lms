import CourseCard from "@/components/common/cards/course-card";
import CreateCourseModal from "@/components/common/modals/create-course-modal";
import PlusIcon from "@/components/icons/plus-icon";
import type { createCourse } from "@/db/client/course";
import type { CourseWithRefsCount } from "@/types/course.type";
import type { ResultOf } from "@/types/utils.type";
import { useState, type FunctionComponent } from "react";

interface Props {
  onCourseCreated: (course: ResultOf<typeof createCourse>) => void;
  courses: CourseWithRefsCount[];
}

const LatestCourses: FunctionComponent<Props> = ({
  courses,
  onCourseCreated,
}) => {
  const [isCreateCourseModal, setIsCreateCourseModal] = useState(false);

  const onCreateCourseModalClose = (
    maybeCourse?: ResultOf<typeof createCourse>
  ) => {
    setIsCreateCourseModal(false);

    if (maybeCourse) onCourseCreated(maybeCourse);
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Latest courses</h2>
      <div className="overflow-x-auto flex gap-4 mt-2 whitespace-nowrap pb-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        <div
          onClick={() => setIsCreateCourseModal(true)}
          className="min-w-14 min-h-14 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-500 inter-active"
        >
          <PlusIcon size="sm" />
        </div>
      </div>
      {isCreateCourseModal && (
        <CreateCourseModal onClose={onCreateCourseModalClose} />
      )}
    </div>
  );
};

export default LatestCourses;
