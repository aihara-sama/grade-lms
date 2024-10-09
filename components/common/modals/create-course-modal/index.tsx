import BasicInput from "@/components/common/inputs/basic-input";
import BasicModal from "@/components/common/modals/basic-modal";
import CoursesIcon from "@/components/icons/courses-icon";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { createCourse } from "@/db/client/course";
import type { TablesInsert } from "@/types/supabase.type";
import type { ResultOf } from "@/types/utils.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onClose: (maybeCourse?: ResultOf<typeof createCourse>) => void;
}

const CreateCourseModal: FunctionComponent<Props> = ({ onClose }) => {
  // Hooks
  const t = useTranslations();

  // State
  const [course, setCourse] = useState<TablesInsert<"courses">>({
    title: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const submitCreateCourse = async () => {
    setIsSubmitting(true);

    try {
      const data = await createCourse(course);
      onClose(data);

      toast.success(t("success.course_created"));
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
    <BasicModal
      isFixedHeight={false}
      onClose={() => onClose()}
      title={t("modal.titles.create_course")}
    >
      <BasicInput
        fullWidth
        name="title"
        label={t("labels.course_name")}
        value={course.title}
        StartIcon={<CoursesIcon />}
        placeholder={t("placeholders.my_course")}
        onChange={onInputChange}
        autoFocus
      />
      <div className="flex justify-end gap-3">
        <button className="outline-button" onClick={() => onClose()}>
          {t("buttons.cancel")}
        </button>
        <button
          type="button"
          onClick={submitCreateCourse}
          disabled={!course.title || isSubmitting}
          className="primary-button"
        >
          {isSubmitting && <LoadingSpinner />}
          <span className={`${clsx(isSubmitting && "opacity-0")}`}>
            {t("buttons.create")}
          </span>
        </button>
      </div>
    </BasicModal>
  );
};
export default CreateCourseModal;
