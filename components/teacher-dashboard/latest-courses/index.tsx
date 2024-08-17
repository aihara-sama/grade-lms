import CreateCourseModal from "@/components/common/modals/create-course-modal";
import CourseCard from "@/components/course-card";
import PlusIcon from "@/components/icons/plus-icon";
import type { CourseWithRefsCount } from "@/types/courses.type";
import { useState, type FunctionComponent } from "react";

interface IProps {
  onCourseCreated: () => void;
  courses: CourseWithRefsCount[];
}

const LatestCourses: FunctionComponent<IProps> = ({
  courses,
  onCourseCreated,
}) => {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

  const openCreateCourseModal = () => setIsCreateCourseModalOpen(true);

  return (
    <div>
      <h2 className="font-bold text-lg">Latest courses</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-4 mt-2 whitespace-nowrap pb-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          <div
            onClick={openCreateCourseModal}
            className="min-w-14 min-h-14 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-500 interactive"
          >
            <PlusIcon size="sm" />
          </div>
        </div>
      </div>
      <CreateCourseModal
        onDone={onCourseCreated}
        isOpen={isCreateCourseModalOpen}
        setIsOpen={setIsCreateCourseModalOpen}
      />
    </div>
  );
};

export default LatestCourses;
