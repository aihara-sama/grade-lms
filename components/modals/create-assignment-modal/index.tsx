import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { getNextMorning } from "@/utils/get-next-morning";
import { supabaseClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

import type { Assignment } from "@/types/assignments.type";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
interface IProps {
  onDone: () => void;
  closeModal: () => void;
  assignmentId?: string;
  lessonId: string;
}
const CreateAssignmentModal: FunctionComponent<IProps> = ({
  onDone,
  closeModal,
  assignmentId,
  lessonId,
}) => {
  // States
  const [assignment, setAssignment] = useState<Omit<Assignment, "id">>({
    lesson_id: lessonId,
    title: "",
    body: "{}",
    due_date: format(getNextMorning(), "yyyy-MM-dd'T'HH:mm:ss"),
  });

  // Vars

  // Handlers
  const handleCreateAssignment = async () => {
    const { error } = await supabaseClient
      .from("assignments")
      .insert(assignment);

    toast(error?.message || "Assignment created");

    if (!error) {
      onDone();
    }
  };
  const handleChangeDate = (date: Date) => {
    setAssignment((_assignment) => ({
      ..._assignment,
      due_date: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
    }));
  };

  // Effects
  useEffect(() => {
    if (assignmentId) {
      (async () => {
        const { data, error } = await supabaseClient
          .from("assignments")
          .select("*")
          .eq("id", assignmentId)
          .single();
        if (error) {
          toast.error(error.message);
        } else {
          setAssignment(data);
        }
      })();
    }
  }, []);

  return (
    <Modal
      width="lg"
      close={closeModal}
      title="Assignment"
      content={
        <div>
          <Input
            fullWIdth
            Icon={<LessonsIcon size="xs" />}
            placeholder="Assignment name"
            name="title"
            onChange={(e) =>
              setAssignment((prev) => ({ ...prev, title: e.target.value }))
            }
            value={assignment.title}
          />
          <p>Description</p>
          <div className="min-h-[320px]">
            {" "}
            <Editor
              onChange={(data) =>
                setAssignment((prev) => ({
                  ...prev,
                  body: JSON.stringify(data),
                }))
              }
              data={JSON.parse(assignment.body)}
            />
          </div>

          <div className="flex gap-3 items-center mt-3">
            <div className="pr-3 border-r-2 border-gray-200">
              <DateInput
                date={new Date(assignment.due_date)}
                onChange={handleChangeDate}
                label="Due date"
                popperPlacement="top-start"
              />
            </div>
            <button className="outline-button">Create & add another</button>
            <button
              disabled={!assignment.title}
              className="primary-button"
              onClick={handleCreateAssignment}
            >
              Create
            </button>
          </div>
        </div>
      }
    />
  );
};

export default CreateAssignmentModal;
