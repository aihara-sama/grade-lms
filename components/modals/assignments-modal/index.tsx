import CardTitle from "@/components/card-title";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import EditIcon from "@/components/icons/edit-icon";
import Modal from "@/components/modal";
import AssignmentModal from "@/components/modals/assignment-modal";
import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

interface IProps {
  close: () => void;
  lessonId: string;
}

const AssignmentsModal: FunctionComponent<IProps> = ({ close, lessonId }) => {
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>();

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

  const deleteAssignment = async (assignmentId: string) => {
    const { error } = await supabaseClient
      .from("assignments")
      .delete()
      .eq("id", assignmentId);

    if (error) {
      toast(error.message);
    } else {
      toast("Assignment deleted");
      getAssignments();
    }
  };
  useEffect(() => {
    getAssignments();
  }, []);

  return (
    <Modal
      close={close}
      title="Assignments"
      content={
        <div>
          <div className="mb-[12px] flex flex-col gap-[12px]">
            {assignments.map((assignment) => (
              <div
                className="flex items-center justify-between"
                key={assignment.id}
              >
                <CardTitle
                  Icon={<AssignmentsIcon size="md" />}
                  title={assignment.title}
                  subtitle="Due date: Tomorrow"
                  onClick={() => {}}
                />
                <div className="flex items-center gap-[12px]">
                  <button
                    className="icon-button shadow-md"
                    onClick={() => {
                      setSelectedAssignmentId(assignment.id);
                      setIsAssignmentModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="icon-button shadow-md"
                    onClick={() => deleteAssignment(assignment.id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="primary-button">Add</button>
          {isAssignmentModalOpen && (
            <AssignmentModal
              onDone={() => {
                getAssignments();
              }}
              assignmentId={selectedAssignmentId}
              close={() => setIsAssignmentModalOpen(false)}
            />
          )}
        </div>
      }
    />
  );
};

export default AssignmentsModal;
