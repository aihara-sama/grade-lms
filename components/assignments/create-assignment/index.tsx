"use client";

import CreateAssignmentModal from "@/components/common/modals/create-assignment-modal";
import AddAssignmentIcon from "@/components/icons/add-assignment-icon";
import { useState, type FunctionComponent } from "react";

interface Props {
  onCreated: () => void;
  courseId: string;
  lessonId: string;
}

const CreateAssignment: FunctionComponent<Props> = ({
  onCreated,
  courseId,
  lessonId,
}) => {
  // States
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] =
    useState(false);

  // Handlers
  const openCreateAssignmentModal = () => setIsCreateAssignmentModalOpen(true);
  const closeCreatessignmentModal = (mutated?: boolean) => {
    setIsCreateAssignmentModalOpen(false);

    if (mutated) {
      onCreated();
    }
  };
  // View
  return (
    <div className="px-6 py-8 border-dashed flex flex-col items-center justify-between w-64 rounded-md border border-light bg-white">
      <AddAssignmentIcon size="md" />
      <hr className="w-full my-3" />
      <button className="primary-button" onClick={openCreateAssignmentModal}>
        Create
      </button>
      {isCreateAssignmentModalOpen && (
        <CreateAssignmentModal
          courseId={courseId}
          lessonId={lessonId}
          onClose={closeCreatessignmentModal}
        />
      )}
    </div>
  );
};

export default CreateAssignment;
