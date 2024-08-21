"use client";

import CreateLessonModal from "@/components/common/modals/create-lesson-modal";
import CreateLessonIcon from "@/components/icons/add-lesson-icon";
import { useState, type FunctionComponent } from "react";

interface IProps {
  onDone: () => void;
  courseId: string;
}

const CreateLesson: FunctionComponent<IProps> = ({ onDone, courseId }) => {
  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false);

  const openCreateLessonModal = () => setIsCreateLessonModalOpen(true);

  return (
    <div className="px-6 py-8 flex flex-col items-center justify-between w-64 rounded-md bg-white border border-light border-dashed text-neutral-600">
      <CreateLessonIcon size="lg" />
      <hr className="w-full my-3" />
      <button className="primary-button" onClick={openCreateLessonModal}>
        Create
      </button>
      <CreateLessonModal
        isOpen={isCreateLessonModalOpen}
        setIsOpen={setIsCreateLessonModalOpen}
        onDone={onDone}
        courseId={courseId}
      />
    </div>
  );
};

export default CreateLesson;
