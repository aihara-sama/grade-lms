import CourseCard from "@/components/common/cards/course-card";
import CreateCourseModal from "@/components/common/modals/create-course-modal";
import UpgradeToProModal from "@/components/common/modals/upgrade-to-pro-modal";
import PlusIcon from "@/components/icons/plus-icon";
import { getCoursesCount, type createCourse } from "@/db/client/course";
import { useUser } from "@/hooks/use-user";
import type { CourseWithRefsCount } from "@/types/course.type";
import type { ResultOf } from "@/types/utils.type";
import { useTranslations } from "next-intl";
import { useState, type FunctionComponent } from "react";

interface Props {
  onCourseCreated: (course: ResultOf<typeof createCourse>) => void;
  courses: CourseWithRefsCount[];
}

const LatestCourses: FunctionComponent<Props> = ({
  courses,
  onCourseCreated,
}) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

  // State
  const [isCreateCourseModal, setIsCreateCourseModal] = useState(false);
  const [isUpgradeToProModal, setIsUpgradeToProModal] = useState(false);

  // Handlers
  const openCreateCourseModal = async () => {
    const { count } = await getCoursesCount();
    if (user.is_pro || count < 3) setIsCreateCourseModal(true);
    else if (count === 3) setIsUpgradeToProModal(true);
  };

  const onCreateCourseModalClose = (
    maybeCourse?: ResultOf<typeof createCourse>
  ) => {
    setIsCreateCourseModal(false);

    if (maybeCourse) onCourseCreated(maybeCourse);
  };

  const onSubscribed = () => {
    setIsUpgradeToProModal(false);
    setIsCreateCourseModal(true);
  };

  // View
  return (
    <div>
      <h2 className="font-bold text-lg">{t("dashboard.latest_courses")}</h2>
      <div className="overflow-x-auto flex gap-4 mt-2 whitespace-nowrap pb-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        <div
          onClick={openCreateCourseModal}
          className="min-w-14 min-h-14 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-500 inter-active"
        >
          <PlusIcon size="sm" />
        </div>
      </div>
      {isCreateCourseModal && (
        <CreateCourseModal onClose={onCreateCourseModalClose} />
      )}
      {isUpgradeToProModal && (
        <UpgradeToProModal
          onClose={() => setIsUpgradeToProModal(false)}
          onSubscribed={onSubscribed}
        />
      )}
    </div>
  );
};

export default LatestCourses;
