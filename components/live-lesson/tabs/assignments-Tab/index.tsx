"use client";

import CardTitle from "@/components/card-title";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import CreateAssignmentModal from "@/components/modals/create-assignment-modal";
import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";

interface IProps {
  lessonId: string;
}

const AssignmentsTab: FunctionComponent<IProps> = ({ lessonId }) => {
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
  useEffect(() => {
    getAssignments();
  }, []);
  return (
    <div>
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
              </button>
            </div>
          </div>
        ))}
      </div>
      {currentAssignmentId && (
        <CreateAssignmentModal
          lessonId={lessonId}
          assignmentId={currentAssignmentId}
          onDone={() => {
            getAssignments();
            setCurrentAssignmentId(undefined);
          }}
          closeModal={() => setCurrentAssignmentId(undefined)}
        />
      )}
    </div>
  );
};

export default AssignmentsTab;
