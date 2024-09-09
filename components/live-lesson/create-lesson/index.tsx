"use client";

import CreateLessonModal from "@/components/common/modals/create-lesson-modal";
import CreateLessonIcon from "@/components/icons/add-lesson-icon";
import { useState, type FunctionComponent } from "react";

interface Props {
  onCreated: () => void;
  courseId: string;
}

const CreateLesson: FunctionComponent<Props> = ({ onCreated, courseId }) => {
  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false);

  const openCreateLessonModal = () => setIsCreateLessonModalOpen(true);
  const closeCreateLessonModal = (mutated?: boolean) => {
    setIsCreateLessonModalOpen(false);

    if (mutated) {
      onCreated();
    }
  };

  return (
    <div className="px-6 py-8 flex flex-col items-center justify-between sm:w-64 w-full rounded-md bg-white border border-light border-dashed text-neutral-600">
      <CreateLessonIcon size="lg" />
      <hr className="w-full my-3" />
      <button className="primary-button" onClick={openCreateLessonModal}>
        Create
      </button>
      {isCreateLessonModalOpen && (
        <CreateLessonModal
          onClose={closeCreateLessonModal}
          courseId={courseId}
        />
      )}
    </div>
  );
};

export default CreateLesson;
