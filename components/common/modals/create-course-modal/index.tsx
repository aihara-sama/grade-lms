import BaseModal from "@/components/common/modals/base-modal";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import { createCourse } from "@/db/course";
import type { TablesInsert } from "@/types/supabase.type";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onClose: (mutated?: boolean) => void;
}

const CreateCourseModal: FunctionComponent<Props> = ({ onClose }) => {
  // State
  const [course, setCourse] = useState<TablesInsert<"courses">>({
    title: "",
  });

  // Handlers
  const submitCreateCourse = async (formData: FormData) => {
    try {
      await createCourse({
        title: formData.get("title") as string,
      });
      onClose(true);
      toast.success("Course created");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourse((_) => ({
      ..._,
      [e.target.name]: e.target.value,
    }));
  };

  // View
  return (
    <BaseModal isExpanded={false} onClose={onClose} title="Create course">
      <form action={submitCreateCourse}>
        <Input
          fullWIdth
          name="title"
          label="Course name"
          value={course.title}
          Icon={<CoursesIcon />}
          placeholder="My course..."
          onChange={onInputChange}
          autoFocus
        />
        <button disabled={!course.title} className="primary-button w-full">
          Create
        </button>
      </form>
    </BaseModal>
  );
};
export default CreateCourseModal;
