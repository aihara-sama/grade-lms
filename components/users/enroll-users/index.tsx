"use client";

import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import AddUserIcon from "@/components/icons/add-user-icon";
import { useState, type FunctionComponent } from "react";

interface IProps {
  onDone: () => void;
  courseId: string;
}

const EnrollUsers: FunctionComponent<IProps> = ({ onDone, courseId }) => {
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);

  // Handlers
  const openEnrollUserModal = () => setIsEnrollUsersModalOpen(true);

  return (
    <div className="border border-dashed px-[24px] py-8 flex flex-col items-center justify-between w-[280px] rounded-[5px] border-light bg-white">
      <AddUserIcon size="lg" />
      <hr className="w-full my-3" />
      <button className="primary-button" onClick={openEnrollUserModal}>
        Enroll
      </button>
      <EnrollUsersInCourseModal
        onDone={onDone}
        courseId={courseId}
        isOpen={isEnrollUsersModalOpen}
        setIsOpen={setIsEnrollUsersModalOpen}
      />
    </div>
  );
};
export default EnrollUsers;
