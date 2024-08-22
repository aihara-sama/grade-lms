"use client";

import CreateAssignmentModal from "@/components/common/modals/create-assignment-modal";
import AddAssignmentIcon from "@/components/icons/add-assignment-icon";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { User } from "@supabase/supabase-js";
import { useState, type FunctionComponent } from "react";

interface IProps {
  onDone: () => void;
  user: User;
  course: Course;
  lesson: Lesson;
}

const CreateAssignment: FunctionComponent<IProps> = ({
  onDone,
  user,
  course,
  lesson,
}) => {
  // States
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] =
    useState(false);

  // Handlers
  const openCreateAssignmentModal = () => setIsCreateAssignmentModalOpen(true);

  // View
  return (
    <div className="px-6 py-8 border-dashed flex flex-col items-center justify-between w-64 rounded-md border border-light bg-white">
      <AddAssignmentIcon size="md" />
      <hr className="w-full my-3" />
      <button className="primary-button" onClick={openCreateAssignmentModal}>
        Create
      </button>
      <CreateAssignmentModal
        course={course}
        lesson={lesson}
        user={user}
        setIsOpen={setIsCreateAssignmentModalOpen}
        isOpen={isCreateAssignmentModalOpen}
        onDone={onDone}
      />
    </div>
  );
};

export default CreateAssignment;
