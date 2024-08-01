"use client";

import AddAssignmentIcon from "@/components/icons/add-assignment-icon";
import AddAssignmentModal from "@/components/modals/add-assignment-modal";
import { useState, type FunctionComponent } from "react";

interface IProps {
  lessonId: string;
  onDone: () => void;
}

const CreateAssignment: FunctionComponent<IProps> = ({ onDone, lessonId }) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const closeModal = () => {
    setIsCreateUserModalOpen(false);
  };
  const openModal = () => {
    setIsCreateUserModalOpen(true);
  };

  return (
    <div className="px-[24px] py-[32px] flex flex-col items-center justify-between w-[250px] rounded-[5px] border border-light bg-white">
      <AddAssignmentIcon size="md" />
      <hr />
      <button className="primary-button w-full" onClick={openModal}>
        Create
      </button>
      {isCreateUserModalOpen && (
        <AddAssignmentModal
          closeModal={closeModal}
          lessonId={lessonId}
          onDone={() => {
            closeModal();
            onDone();
          }}
        />
      )}
    </div>
  );
};

export default CreateAssignment;
