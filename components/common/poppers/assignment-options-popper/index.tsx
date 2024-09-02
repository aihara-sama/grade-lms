import PromptModal from "@/components/common/modals/prompt-modal";
import BasePopper from "@/components/common/poppers/base-popper";
import DeleteIcon from "@/components/icons/delete-icon";
import DotsIcon from "@/components/icons/dots-icon";
import { deleteAssignmentsByAssignmentsIds } from "@/db/assignment";
import { useTranslations } from "next-intl";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  setSelectedAssignmentsIds: Dispatch<SetStateAction<string[]>>;
  assignmentId: string;
  onClose: (mutated?: boolean) => void;
}

const AssignmentOptionsPopper: FunctionComponent<Props> = ({
  assignmentId,
  setSelectedAssignmentsIds,
  onClose,
}) => {
  // State
  const [isDeleteAssignmentModalOpen, setIsDeleteAssignmentModalOpen] =
    useState(false);

  // Hooks
  const t = useTranslations();

  // Handlers
  const openDeleteAssignmentModal = () => setIsDeleteAssignmentModalOpen(true);

  const handleDeleteAssignment = async () => {
    try {
      await deleteAssignmentsByAssignmentsIds([assignmentId]);
      setIsDeleteAssignmentModalOpen(false);
      setSelectedAssignmentsIds((prev) =>
        prev.filter((id) => id !== assignmentId)
      );
      toast.success(t("assignment_deleted"));
      onClose(true);
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
          <li onClick={openDeleteAssignmentModal} className="popper-list-item">
            <DeleteIcon /> Delete
          </li>
        </ul>
      </BasePopper>
      {isDeleteAssignmentModalOpen && (
        <PromptModal
          onClose={() => setIsDeleteAssignmentModalOpen(false)}
          title="Delete assignment"
          action="Delete"
          body={t("prompts.delete_assignment")}
          actionHandler={handleDeleteAssignment}
        />
      )}
    </>
  );
};

export default AssignmentOptionsPopper;
