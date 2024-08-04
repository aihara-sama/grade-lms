"use client";

import AddAssignmentIcon from "@/components/icons/add-assignment-icon";
import CreateAssignmentModal from "@/components/modals/create-assignment-modal";
import { useState, type FunctionComponent } from "react";

interface IProps {
  lessonId: string;
  onDone: () => void;
}

const CreateAssignment: FunctionComponent<IProps> = ({ onDone, lessonId }) => {
  // States
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] =
    useState(false);

  // Handlers
  const closeCreateAssignmentModal = () => {
    setIsCreateAssignmentModalOpen(false);
  };
  const openCreateAssignmentModal = () => {
    setIsCreateAssignmentModalOpen(true);
  };

  // View
  return (
    <div className="px-6 py-8 flex flex-col items-center justify-between w-64 rounded-md border border-light bg-white">
      <AddAssignmentIcon size="md" />
      <hr className="w-full my-3" />
      <button className="primary-button" onClick={openCreateAssignmentModal}>
        Create
      </button>
      {isCreateAssignmentModalOpen && (
        <CreateAssignmentModal
          closeModal={closeCreateAssignmentModal}
          lessonId={lessonId}
          onDone={() => {
            closeCreateAssignmentModal();
            onDone();
          }}
        />
      )}
    </div>
  );
};

export default CreateAssignment;
