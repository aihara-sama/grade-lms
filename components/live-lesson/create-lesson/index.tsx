"use client";

import AddLessonIcon from "@/components/icons/add-lesson-icon";
import AddLessonModal from "@/components/modals/add-lesson-modal";
import { useState, type FunctionComponent } from "react";

interface IProps {
  courseId: string;
  onDone: () => void;
}

const CreateLesson: FunctionComponent<IProps> = ({ courseId, onDone }) => {
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);

  const closeModal = () => {
    setIsAddLessonModalOpen(false);
  };
  const openModal = () => {
    setIsAddLessonModalOpen(true);
  };

  return (
    <div className="px-6 py-8 flex flex-col items-center justify-between w-64 rounded-md bg-white border border-light border-dashed text-neutral-600">
      <AddLessonIcon size="lg" />
      <hr className="w-full my-3" />
      <button className="primary-button" onClick={openModal}>
        Create
      </button>
      {isAddLessonModalOpen && (
        <AddLessonModal
          courseId={courseId}
          closeModal={closeModal}
          onDone={onDone}
        />
      )}
    </div>
  );
};

export default CreateLesson;
