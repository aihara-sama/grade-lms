"use client";

import AddUserIcon from "@/components/icons/add-user-icon";
import EnrollUsersModal from "@/components/modals/enroll-users-modal";
import { useState, type FunctionComponent } from "react";

interface IProps {
  onDone: () => void;
  courseId: string;
}

const EnrollUsers: FunctionComponent<IProps> = ({ onDone, courseId }) => {
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);

  const closeModal = () => {
    setIsEnrollUsersModalOpen(false);
    onDone();
  };
  const openModal = () => {
    setIsEnrollUsersModalOpen(true);
  };

  return (
    <div className="border border-dashed px-[24px] py-[32px] flex flex-col items-center justify-between w-[250px] rounded-[5px] border-light bg-white">
      <AddUserIcon size="lg" />
      <hr className="w-full my-3" />
      <button className="primary-button w-full" onClick={openModal}>
        Enroll
      </button>
      {isEnrollUsersModalOpen && (
        <EnrollUsersModal close={closeModal} courseId={courseId} />
      )}
    </div>
  );
};

export default EnrollUsers;
