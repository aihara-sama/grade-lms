import BaseModal from "@/components/common/modals/base-modal";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import { supabaseClient } from "@/utils/supabase/client";
import type { Dispatch, SetStateAction, FunctionComponent } from "react";
import { useState } from "react";

import toast from "react-hot-toast";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDone: () => void;
}

const CreateCourseModal: FunctionComponent<IProps> = ({
  isOpen,
  setIsOpen,
  onDone,
}) => {
  const [courseTitle, setCourseTitle] = useState("");

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
      setIsOpen(false);
      setCourseTitle("");
      onDone();
    }
  };

  return (
    <BaseModal
      isExpanded={false}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
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
  );
};

export default CreateCourseModal;
