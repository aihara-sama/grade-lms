"use client";

import AddUserIcon from "@/components/icons/add-user-icon";
import CreateUserModal from "@/components/modals/create-user-modal";
import { useState, type FunctionComponent } from "react";

interface IProps {
  onDone: () => void;
}

const CreateUser: FunctionComponent<IProps> = ({ onDone }) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const closeModal = () => {
    setIsCreateUserModalOpen(false);
  };
  const openModal = () => {
    setIsCreateUserModalOpen(true);
  };

  return (
    <div className="px-[24px] py-[32px] flex flex-col items-center justify-between w-[250px] rounded-[5px] border border-light bg-white">
      <AddUserIcon size="lg" />
      <hr />
      <button className="primary-button" onClick={openModal}>
        Create
      </button>
      {isCreateUserModalOpen && (
        <CreateUserModal closeModal={closeModal} onDone={onDone} />
      )}
    </div>
  );
};

export default CreateUser;
