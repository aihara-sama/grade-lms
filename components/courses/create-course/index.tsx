"use client";

import AddCourseIcon from "@/components/icons/add-course-icon";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  onDone: () => void;
  userId: string;
}

const CreateCourse: FunctionComponent<IProps> = ({ onDone }) => {
  const router = useRouter();
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

  const closeModal = () => {
    setIsCreateCourseModalOpen(false);
  };
  const openModal = () => {
    setIsCreateCourseModalOpen(true);
  };

  const submitCreateCourse = async (formData: FormData) => {
    const { error, data } = await supabaseClient
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
      onDone();
      router.push(`/dashboard/courses/${data.id}/overview`);
    }
  };

  return (
    <div className="border border-dashed border-light bg-white px-[24px] py-[32px] flex flex-col items-center justify-between sm:w-[250px] w-full rounded-[5px]">
      <AddCourseIcon />
      <hr className="w-full my-3" />
      <button className="primary-button" onClick={openModal}>
        Create
      </button>
      {isCreateCourseModalOpen && (
        <Modal
          close={closeModal}
          title="Create course"
          content={
            <form action={submitCreateCourse}>
              <Input
                label="Course name"
                Icon={<CoursesIcon />}
                placeholder="My course..."
                name="title"
                autoFocus
              />
              <button className="primary-button" type="submit">
                Create
              </button>
            </form>
          }
        />
      )}
    </div>
  );
};

export default CreateCourse;
