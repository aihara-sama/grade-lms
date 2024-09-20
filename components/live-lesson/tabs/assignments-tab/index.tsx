"use client";

import CardTitle from "@/components/card-title";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import { DB } from "@/lib/supabase/db";
import { useEffect, useState } from "react";

import CreateAssignmentModal from "@/components/common/modals/create-assignment-modal";
import EditAssignmentModal from "@/components/common/modals/edit-assignment-modal";
import PromptModal from "@/components/common/modals/prompt-modal";
import { deleteAssignmentById } from "@/db/assignment";
import type { Assignment } from "@/types/assignment.type";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface Props {
  lessonId: string;
}

const AssignmentsTab: FunctionComponent<Props> = ({ lessonId }) => {
  // States
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] =
    useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] =
    useState(false);
  const [isDeleteAssignmentModalOpen, setIsDeleteAssignmentModalOpen] =
    useState(false);
  const [isSubmittingDeleteAssignments, setIsSubmittingDeleteAssignments] =
    useState(false);

  const t = useTranslations();

  const openEditAssignmentModal = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setIsEditAssignmentModalOpen(true);
  };
  const openDeleteAssignmentModal = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setIsDeleteAssignmentModalOpen(true);
  };

  const fetchAssignments = async () => {
    const data = await DB.from("assignments")
      .select("*")
      .eq("lesson_id", lessonId);

    setAssignments(data.data);
  };

  const submitDeleteAssignment = async () => {
    setIsSubmittingDeleteAssignments(true);
    try {
      await deleteAssignmentById(selectedAssignmentId);
      setIsDeleteAssignmentModalOpen(false);
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingDeleteAssignments(false);
    }
  };

  const onCreateAssignmentModalClose = (mutated?: boolean) => {
    setIsCreateAssignmentModalOpen(false);

    if (mutated) {
      fetchAssignments();
    }
  };

  const onEditAssignmentModalClose = (mutated?: boolean) => {
    setIsEditAssignmentModalOpen(false);

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
            <CardTitle
              Icon={<AssignmentsIcon size="sm" />}
              title={assignment.title}
              subtitle="Due date: Tomorrow"
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
          onClick={() => setIsCreateAssignmentModalOpen(true)}
        >
          Create
        </button>
      </div>
      {isCreateAssignmentModalOpen && (
        <CreateAssignmentModal
          onClose={onCreateAssignmentModalClose}
          lessonId={lessonId}
        />
      )}
      {isEditAssignmentModalOpen && (
        <EditAssignmentModal
          assignmentId={selectedAssignmentId}
          onClose={onEditAssignmentModalClose}
        />
      )}
      {isDeleteAssignmentModalOpen && (
        <PromptModal
          isSubmitting={isSubmittingDeleteAssignments}
          onClose={() => setIsDeleteAssignmentModalOpen(false)}
          title="Delete assignment"
          action="Delete"
          body={t("prompts.delete_assignment")}
          actionHandler={submitDeleteAssignment}
        />
      )}
    </div>
  );
};
export default AssignmentsTab;
