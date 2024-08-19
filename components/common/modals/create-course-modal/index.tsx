import BaseModal from "@/components/common/modals/base-modal";
import CoursesIcon from "@/components/icons/courses-icon";
import Input from "@/components/input";
import { createCourse } from "@/db/course";
import type { TablesInsert } from "@/types/supabase.type";
import type {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
} from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const initCourse: TablesInsert<"courses"> = {
  title: "",
};

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
  // State
  const [course, setCourse] = useState<TablesInsert<"courses">>(initCourse);

  // Handlers
  const closeCreateCourseModal = () => setIsOpen(false);

  const handeChangeCourseTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setCourse({
      title: e.target.value,
    });
  };
  const submitCreateCourse = async (formData: FormData) => {
    try {
      await createCourse({
        title: formData.get("title") as string,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toast.success("Course created");
      closeCreateCourseModal();
      setCourse(initCourse);
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
          fullWIdth
          name="title"
          label="Course name"
          value={course.title}
          Icon={<CoursesIcon />}
          placeholder="My course..."
          onChange={handeChangeCourseTitle}
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
