"use client";

import EnrollUsersModal from "@/components/common/modals/enroll-users-modal";
import AddUserIcon from "@/components/icons/add-user-icon";
import type { User as IUser } from "@supabase/supabase-js";
import { useState, type FunctionComponent } from "react";

interface IProps {
  onDone: () => void;
  courseId: string;

  user: IUser;
}

const EnrollUsers: FunctionComponent<IProps> = ({ onDone, courseId, user }) => {
  const [isEnrollUsersModalOpen, setIsEnrollUsersModalOpen] = useState(false);

  return (
    <div className="border border-dashed px-[24px] py-[32px] flex flex-col items-center justify-between w-[250px] rounded-[5px] border-light bg-white">
      <AddUserIcon size="lg" />
      <hr className="w-full my-3" />
      <button
        className="primary-button"
        onClick={() => setIsEnrollUsersModalOpen(true)}
      >
        Enroll
      </button>
      <EnrollUsersModal
        onDone={onDone}
        user={user}
        courseId={courseId}
        isOpen={isEnrollUsersModalOpen}
        setIsOpen={(isOpen) => setIsEnrollUsersModalOpen(isOpen)}
      />
    </div>
  );
};

export default EnrollUsers;
