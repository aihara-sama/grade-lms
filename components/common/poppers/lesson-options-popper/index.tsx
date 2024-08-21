import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import { deleteLessonsByLessonsIds } from "@/db/lesson";
import { useTranslations } from "next-intl";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface IProps {
  setSelectedLessonsIds: Dispatch<SetStateAction<string[]>>;
  lessonId: string;
  onDone: () => void;
}

const LessonOptionsPopper: FunctionComponent<IProps> = ({
  lessonId,
  setSelectedLessonsIds,
  onDone,
}) => {
  // State
  const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);

  // Hooks
  const t = useTranslations();

  // Handlers
  const openDeleteLessonModal = () => setIsDeleteLessonModalOpen(true);

  const handleDeleteLesson = async () => {
    try {
      await deleteLessonsByLessonsIds([lessonId]);
      setIsDeleteLessonModalOpen(false);
      setSelectedLessonsIds((prev) => prev.filter((id) => id !== lessonId));
      toast.success(t("lesson_deleted"));
      onDone();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <BasePopper
        width="sm"
        trigger={
          <button className="icon-button text-neutral-500">
            <DotsIcon />
          </button>
        }
      >
        <ul className="flex flex-col">
          <li onClick={openDeleteLessonModal} className="popper-list-item">
            <DeleteIcon /> Delete
          </li>
        </ul>
      </BasePopper>
      <PromptModal
        setIsOpen={setIsDeleteLessonModalOpen}
        isOpen={isDeleteLessonModalOpen}
        title="Delete lesson"
        action="Delete"
        body={t("prompts.delete_lesson")}
        actionHandler={handleDeleteLesson}
      />
    </>
  );
};

export default LessonOptionsPopper;