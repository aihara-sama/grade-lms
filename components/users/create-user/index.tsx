"use client";

import AddUserIcon from "@/components/icons/add-user-icon";
import CreateUserModal from "@/components/modals/create-user-modal";
import type { User } from "@supabase/supabase-js";
import { useState, type FunctionComponent } from "react";

interface IProps {
  onDone: () => void;
  user: User;
}

const CreateUser: FunctionComponent<IProps> = ({ onDone, user }) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  return (
    <div className="px-[24px] py-[32px] flex flex-col items-center justify-between w-[250px] rounded-[5px] border border-dashed border-light bg-white">
      <AddUserIcon size="lg" />
      <hr />
      <button
        className="primary-button"
        onClick={() => setIsCreateUserModalOpen(true)}
      >
        Create
      </button>
      <CreateUserModal
        user={user}
        isOpen={isCreateUserModalOpen}
        setIsOpen={(isOpen) => setIsCreateUserModalOpen(isOpen)}
        onDone={onDone}
      />
    </div>
  );
};

export default CreateUser;
