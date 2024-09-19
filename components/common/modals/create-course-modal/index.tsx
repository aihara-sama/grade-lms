import BaseModal from "@/components/common/modals/base-modal";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import { createCourse } from "@/db/course";
import { useUser } from "@/hooks/use-user";
import type { TablesInsert } from "@/types/supabase.type";
import clsx from "clsx";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onClose: (mutated?: boolean) => void;
}

const CreateCourseModal: FunctionComponent<Props> = ({ onClose }) => {
  // Hooks
  const { user } = useUser();

  // State
  const [course, setCourse] = useState<TablesInsert<"courses">>({
    title: "",
    creator_id: user.id,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const submitCreateCourse = async () => {
    setIsSubmitting(true);

    try {
      await createCourse(course);
      onClose(true);
      toast.success("Course created");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
    <BaseModal
      isExpanded={false}
      onClose={() => onClose()}
      title="Create course"
    >
      <Input
        fullWidth
        name="title"
        label="Course name"
        value={course.title}
        startIcon={<CoursesIcon />}
        placeholder="My course..."
        onChange={onInputChange}
        autoFocus
      />
      <button
        type="button"
        onClick={submitCreateCourse}
        disabled={!course.title || isSubmitting}
        className="primary-button w-full"
      >
        {isSubmitting && (
          <img
            className="loading-spinner"
            src="/gifs/loading-spinner.gif"
            alt=""
          />
        )}
        <span className={`${clsx(isSubmitting && "opacity-0")}`}>Create</span>
      </button>
    </BaseModal>
  );
};
export default CreateCourseModal;
