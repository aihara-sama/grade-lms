"use client";

import CreateUserModal from "@/components/common/modals/create-user-modal";
import AddUserIcon from "@/components/icons/add-user-icon";
import { useState, type FunctionComponent } from "react";

interface Props {
  onUserCreated: () => void;
}

const CreateUser: FunctionComponent<Props> = ({ onUserCreated }) => {
  // State
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  // Handlers
  const onCreateUserModalClose = (mutated?: boolean) => {
    setIsCreateUserModalOpen(false);

    if (mutated) {
      onUserCreated();
    }
  };

  // View
  return (
    <div className="px-[24px] py-8 flex flex-col items-center justify-between w-[280px] rounded-[5px] border border-dashed border-light bg-white">
      <AddUserIcon size="lg" />
      <hr />
      <button
        className="primary-button"
        onClick={() => setIsCreateUserModalOpen(true)}
      >
        Create
      </button>
      {isCreateUserModalOpen && (
        <CreateUserModal onClose={onCreateUserModalClose} />
      )}
    </div>
  );
};

export default CreateUser;
