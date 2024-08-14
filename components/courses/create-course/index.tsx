"use client";

import BaseModal from "@/components/common/modals/base-modal";
import AddCourseIcon from "@/components/icons/add-course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import { supabaseClient } from "@/utils/supabase/client";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  onDone: () => void;
  userId: string;
}

const CreateCourse: FunctionComponent<IProps> = ({ onDone }) => {
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");

  const closeModal = () => {
    setIsCreateCourseModalOpen(false);
  };
  const openModal = () => {
    setIsCreateCourseModalOpen(true);
  };

  const submitCreateCourse = async (formData: FormData) => {
    const { error } = await supabaseClient
      .from("courses")
      .insert({
        title: formData.get("title") as string,
      })
      .select("id")
      .single();

    if (error) {
      toast(error.message);
    } else {
      toast("Course created");
      closeModal();
      setCourseTitle("");
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
