"use client";

import CreateCourseModal from "@/components/common/modals/create-course-modal";
import AddCourseIcon from "@/components/icons/add-course-icon";
import type { FunctionComponent } from "react";
import { useState } from "react";

interface Props {
  onCreated: () => void;
}

const CreateCourse: FunctionComponent<Props> = ({ onCreated }) => {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

  const openCreateCourseModal = () => setIsCreateCourseModalOpen(true);
  const closeCreateCourseModal = (mutated?: boolean) => {
    setIsCreateCourseModalOpen(false);

    if (mutated) {
      onCreated();
    }
  };
  return (
    <div className="border border-dashed border-light bg-white px-6 py-8 flex flex-col items-center justify-between sm:w-64 w-full rounded-md">
      <AddCourseIcon />
      <hr className="w-full my-3" />
      <button className="primary-button w-full" onClick={openCreateCourseModal}>
        Create
      </button>
      {isCreateCourseModalOpen && (
        <CreateCourseModal onClose={closeCreateCourseModal} />
      )}
    </div>
  );
};

export default CreateCourse;
