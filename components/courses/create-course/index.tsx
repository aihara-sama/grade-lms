"use client";

import CreateCourseModal from "@/components/common/modals/create-course-modal";
import AddCourseIcon from "@/components/icons/add-course-icon";
import type { FunctionComponent } from "react";
import { useState } from "react";

interface IProps {
  onDone: () => void;
}

const CreateCourse: FunctionComponent<IProps> = ({ onDone }) => {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

  const openCreateCourseModal = () => setIsCreateCourseModalOpen(true);

  return (
    <div className="border border-dashed border-light bg-white px-6 py-8 flex flex-col items-center justify-between sm:w-64 w-full rounded-md">
      <AddCourseIcon />
      <hr className="w-full my-3" />
      <button className="primary-button w-full" onClick={openCreateCourseModal}>
        Create
      </button>
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        setIsOpen={setIsCreateCourseModalOpen}
        onDone={onDone}
      />
    </div>
  );
};

export default CreateCourse;
