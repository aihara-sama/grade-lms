import CreateCourseModal from "@/components/common/modals/create-course-modal";
import CourseCard from "@/components/course-card";
import PlusIcon from "@/components/icons/plus-icon";
import type { CourseWithRefsCount } from "@/types/courses.type";
import { useState, type FunctionComponent } from "react";

interface Props {
  onCourseCreated: () => void;
  courses: CourseWithRefsCount[];
}

const LatestCourses: FunctionComponent<Props> = ({
  courses,
  onCourseCreated,
}) => {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

  const onCreateCourseModalClose = (mutated?: boolean) => {
    setIsCreateCourseModalOpen(false);

    if (mutated) {
      onCourseCreated();
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Latest courses</h2>
      <div className="overflow-x-auto flex gap-4 mt-2 whitespace-nowrap pb-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        <div
          onClick={() => setIsCreateCourseModalOpen(true)}
          className="min-w-14 min-h-14 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-500 inter-active"
        >
          <PlusIcon size="sm" />
        </div>
      </div>
      {isCreateCourseModalOpen && (
        <CreateCourseModal onClose={onCreateCourseModalClose} />
      )}
    </div>
  );
};

export default LatestCourses;
