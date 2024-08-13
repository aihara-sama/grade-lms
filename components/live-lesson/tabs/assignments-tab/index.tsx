"use client";

import DeleteButton from "@/components/buttons/delete-button";
import CardTitle from "@/components/card-title";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import EditAssignmentModal from "@/components/modals/edit-assignment-modal";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

import type { Database } from "@/types/supabase.type";
import type { FunctionComponent } from "react";

interface IProps {
  lessonId: string;
}

const AssignmentsTab: FunctionComponent<IProps> = ({ lessonId }) => {
  // States
  const [, setIsCreateAssignmentModalOpen] = useState(false);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] =
    useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<
    string | undefined
  >();
  const [assignments, setAssignments] = useState<
    Database["public"]["Tables"]["assignments"]["Row"][]
  >([]);

  const getAssignments = async () => {
    const data = await supabaseClient
      .from("assignments")
      .select("*")
      .eq("lesson_id", lessonId);

    setAssignments(data.data);
  };

  const deleteAssignment = async (
    assignmentId: string
  ): Promise<{ error: string | null; data: null }> => {
    const { error } = await supabaseClient
      .from("assignments")
      .delete()
      .eq("id", assignmentId);

    return {
      data: null,
      error: error ? error.message : null,
    };
  };

  useEffect(() => {
    getAssignments();
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-[12px] flex flex-col gap-[6px]">
        {assignments.map((assignment) => (
          <div
            className="flex items-center justify-between cursor-pointer p-[8px] hover:bg-slate-100"
            key={assignment.id}
          >
            <CardTitle
              Icon={<AssignmentsIcon size="sm" />}
              title={assignment.title}
              subtitle="Due date: Tomorrow"
              onClick={() => setCurrentAssignmentId(assignment.id)}
            />
            <div className="flex items-center gap-[12px]">
              <button className="icon-button shadow-md">
                <DeleteIcon />
                <DeleteButton
                  onDone={getAssignments}
                  action={deleteAssignment}
                  record="assignment"
                  id={assignment.id}
                  key={assignment.id}
                />
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
          Create assignments
        </button>
      </div>
      {currentAssignmentId && (
        <EditAssignmentModal
          assignmentId={currentAssignmentId}
          onDone={() => {
            getAssignments();
            setCurrentAssignmentId(undefined);
          }}
          setIsOpen={setIsEditAssignmentModalOpen}
          isOpen={isEditAssignmentModalOpen}
        />
      )}
      {/* {isCreateAssignmentModalOpen && (
        <CreateAssignmentModal
          closeModal={() => setIsCreateAssignmentModalOpen(false)}
          onDone={() => {
            setIsCreateAssignmentModalOpen(false);
            getAssignments();
          }}
        />
      )} */}
    </div>
  );
};

export default AssignmentsTab;
