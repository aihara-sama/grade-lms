"use client";

import EnrollUsersInCourseModal from "@/components/common/modals/enroll-users-in-course-modal";
import AddUserIcon from "@/components/icons/add-user-icon";
import { useState, type FunctionComponent } from "react";

interface Props {
  onUsersEnrolled: (usersIds: string[]) => void;
  courseId: string;
}

const EnrollUsers: FunctionComponent<Props> = ({
  onUsersEnrolled,
  courseId,
}) => {
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);

  // Handlers
  const openEnrollUserModal = () => setIsEnrollUsersModalOpen(true);
  const onEnrollUsersInCourseModalClose = (usersIds: string[]) => {
    setIsEnrollUsersModalOpen(false);

    onUsersEnrolled(usersIds);
  };

  return (
    <div className="border border-dashed px-[24px] py-8 flex flex-col items-center justify-between w-[280px] rounded-[5px] border-light bg-white">
      <AddUserIcon size="lg" />
      <hr className="w-full my-3" />
      <button className="primary-button" onClick={openEnrollUserModal}>
        Enroll
      </button>
      {isEnrollUsersModalOpen && (
        <EnrollUsersInCourseModal
          onClose={onEnrollUsersInCourseModalClose}
          courseId={courseId}
        />
      )}
    </div>
  );
};
export default EnrollUsers;
