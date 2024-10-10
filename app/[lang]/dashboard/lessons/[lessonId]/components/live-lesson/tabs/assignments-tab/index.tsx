"use client";

import TitleCard from "@/components/common/cards/title-card";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import { useEffect, useState } from "react";

import { revalidatePageAction } from "@/actions/revalidate-page-action";
import CreateAssignmentModal from "@/components/common/modals/create-assignment-modal";
import ViewAssignmentModal from "@/components/common/modals/edit-assignment-modal";
import PromptDeleteRecordModal from "@/components/common/modals/prompt-delete-record-modal";
import type { createAssignment } from "@/db/client/assignment";
import { deleteAssignment, getLessonAssignments } from "@/db/client/assignment";
import type { Assignment } from "@/types/assignment.type";
import type { ResultOf } from "@/types/utils.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  lessonId: string;
}

const AssignmentsTab: FunctionComponent<Props> = ({ lessonId }) => {
  // States
  const [isEditAssignmentModal, setIsEditAssignmentModal] = useState(false);
  const [isCreateAssignmentModal, setIsCreateAssignmentModal] = useState(false);
  const [isDeleteAssignmentModal, setIsDeleteAssignmentModal] = useState(false);

  const [assignmentId, setAssignmentId] = useState<string>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Hooks
  const t = useTranslations();

  // Handlers
  const openEditAssignmentModal = (_assignmentId: string) => {
    setAssignmentId(_assignmentId);
    setIsEditAssignmentModal(true);
  };
  const openDeleteAssignmentModal = (_assignmentId: string) => {
    setAssignmentId(_assignmentId);
    setIsDeleteAssignmentModal(true);
  };

  const fetchAssignments = async () => {
    const { data } = await getLessonAssignments(lessonId);

    setAssignments(data);
  };

  const submitDeleteAssignment = async () => {
    try {
      await deleteAssignment(assignmentId);

      setAssignments((_) => _.filter(({ id }) => id !== assignmentId));

      setIsDeleteAssignmentModal(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onCreateAssignmentModalClose = (
    maybeAssignment?: ResultOf<typeof createAssignment>
  ) => {
    setIsCreateAssignmentModal(false);

    if (maybeAssignment) {
      revalidatePageAction();
      fetchAssignments();
    }
  };

  const onEditAssignmentModalClose = (mutated?: boolean) => {
    setIsEditAssignmentModal(false);

    if (mutated) {
      fetchAssignments();
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-[12px] flex flex-col gap-[6px]">
        {assignments.map((assignment) => (
          <div
            className="flex items-center justify-between cursor-pointer p-[8px] hover:bg-neutral-50"
            key={assignment.id}
          >
            <TitleCard
              Icon={<AssignmentsIcon size="sm" />}
              title={assignment.title}
              subtitle=""
              onClick={() => openEditAssignmentModal(assignment.id)}
            />
            <div
              className="flex items-center gap-[12px]"
              onClick={() => openDeleteAssignmentModal(assignment.id)}
            >
              <button className="icon-button">
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <button
          className="outline-button w-full"
          onClick={() => setIsCreateAssignmentModal(true)}
        >
          Create
        </button>
      </div>
      {isCreateAssignmentModal && (
        <CreateAssignmentModal
          onClose={onCreateAssignmentModalClose}
          lessonId={lessonId}
        />
      )}
      {isEditAssignmentModal && (
        <ViewAssignmentModal
          assignmentId={assignmentId}
          onClose={onEditAssignmentModalClose}
        />
      )}
      {isDeleteAssignmentModal && (
        <PromptDeleteRecordModal
          title={t("modal.titles.delete_assignment")}
          prompt={`${t("prompts.delete_assignment")}`}
          confirmText={t("buttons.delete")}
          record={assignments.find(({ id }) => id === assignmentId).title}
          onClose={() => setIsDeleteAssignmentModal(false)}
          onConfirm={submitDeleteAssignment}
        />
      )}
    </div>
  );
};
export default AssignmentsTab;
