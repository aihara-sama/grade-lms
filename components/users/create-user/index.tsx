"use client";

import CreateUserModal from "@/components/common/modals/create-user-modal";
import AddUserIcon from "@/components/icons/add-user-icon";
import { useState, type FunctionComponent } from "react";

interface IProps {
  onDone: () => void;
}

const CreateUser: FunctionComponent<IProps> = ({ onDone }) => {
  // State
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  // Handlers
  const openCreateUserModal = () => setIsCreateUserModalOpen(true);

  // View
  return (
    <div className="px-[24px] py-8 flex flex-col items-center justify-between w-[280px] rounded-[5px] border border-dashed border-light bg-white">
      <AddUserIcon size="lg" />
      <hr />
      <button className="primary-button" onClick={openCreateUserModal}>
        Create
      </button>
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        setIsOpen={setIsCreateUserModalOpen}
        onDone={onDone}
      />
    </div>
  );
};

export default CreateUser;
