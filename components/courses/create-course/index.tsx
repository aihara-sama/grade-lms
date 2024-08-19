"use client";

import BaseModal from "@/components/common/modals/base-modal";
import AddCourseIcon from "@/components/icons/add-course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import { createCourse } from "@/db/course";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  onDone: () => void;
  userId: string;
}

const CreateCourse: FunctionComponent<IProps> = ({ onDone }) => {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");

  const closeModal = () => setIsCreateCourseModalOpen(false);
  const openModal = () => setIsCreateCourseModalOpen(true);

  const submitCreateCourse = async (formData: FormData) => {
    try {
      await createCourse(formData.get("title") as string);

      toast("Course created");
      closeModal();
      setCourseTitle("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      onDone();
    }
  };

  return (
    <div className="border border-dashed border-light bg-white px-6 py-8 flex flex-col items-center justify-between sm:w-64 w-full rounded-md">
      <AddCourseIcon />
      <hr className="w-full my-3" />
      <button className="primary-button w-full" onClick={openModal}>
        Create
      </button>
      <BaseModal
        isExpanded={false}
        setIsOpen={setIsCreateCourseModalOpen}
        isOpen={isCreateCourseModalOpen}
        title="Create course"
      >
        <form action={submitCreateCourse}>
          <Input
            autoFocus
            fullWIdth
            name="title"
            label="Course name"
            value={courseTitle}
            Icon={<CoursesIcon />}
            placeholder="My course..."
            onChange={(e) => setCourseTitle(e.target.value)}
          />
          <button disabled={!courseTitle} className="primary-button w-full">
            Create
          </button>
        </form>
      </BaseModal>
    </div>
  );
};

export default CreateCourse;
