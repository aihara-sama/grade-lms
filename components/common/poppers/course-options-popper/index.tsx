import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import UsersIcon from "@/components/icons/users-icon";
import { deleteCourseByCourseId } from "@/db/course";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useState } from "react";

import toast from "react-hot-toast";

interface Props {
  setSelectedCoursesIds: Dispatch<SetStateAction<string[]>>;
  courseId: string;
  onDone: () => void;
}

const CourseOptionsPopper: FunctionComponent<Props> = ({
  courseId,
  setSelectedCoursesIds,
  onDone,
}) => {
  // State
  const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState(false);
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);

  // Handlers
  const openEnrollUsersModal = () => setIsEnrollUsersModalOpen(true);
  const openDeleteCourseModal = () => setIsDeleteCourseModalOpen(true);

  const handleDeleteCourse = async () => {
    try {
      await deleteCourseByCourseId(courseId);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleteCourseModalOpen(false);
      setSelectedCoursesIds((prev) => prev.filter((id) => id !== courseId));
      onDone();
      toast.success("Success");
    }
  };

  return (
    <>
      <BasePopper
        width="sm"
        trigger={
          <button className="icon-button text-neutral-500">
            <DotsIcon />
          </button>
        }
      >
        <ul className="flex flex-col">
          <li onClick={openEnrollUsersModal} className="popper-list-item">
            <UsersIcon /> Enroll
          </li>
          <li onClick={openDeleteCourseModal} className="popper-list-item">
            <DeleteIcon /> Delete
          </li>
        </ul>
      </BasePopper>
      {isDeleteCourseModalOpen && (
        <PromptModal
          onClose={() => setIsDeleteCourseModalOpen(false)}
          title="Delete course"
          action="Delete"
          body="Are you sure you want to delete this course?"
          actionHandler={handleDeleteCourse}
        />
      )}
      {isEnrollUsersModalOpen && (
        <EnrollUsersInCourseModal
          courseId={courseId}
          onClose={() => setIsEnrollUsersModalOpen(false)}
        />
      )}
    </>
  );
};

export default CourseOptionsPopper;
