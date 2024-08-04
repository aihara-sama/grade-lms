import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import Modal from "@/components/modal";
import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import {
  addDays,
  addMinutes,
  millisecondsToMinutes,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import dynamic from "next/dynamic";
import { useEffect, useState, type FunctionComponent } from "react";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
interface IProps {
  onDone: () => void;
  closeModal: () => void;
  assignmentId?: string;
  lessonId: string;
}
const AddAssignmentModal: FunctionComponent<IProps> = ({
  onDone,
  closeModal,
  assignmentId,
  lessonId,
}) => {
  const [assignment, setAssignment] = useState<
    Database["public"]["Tables"]["assignments"]["Row"]
  >({
    id: undefined,
    lesson_id: lessonId,
    title: "",
    body: "{}",
  });

  const [starts, setStarts] = useState<Date>(
    addDays(setSeconds(setMinutes(setHours(new Date(), 8), 0), 0), 1)
  );
  const [ends, setEnds] = useState<Date>(addMinutes(starts, 30));
  const duration = +new Date(ends) - +new Date(starts);

  const handleCreateAssignment = async () => {
    const { error } = await supabaseClient
      .from("assignments")
      .upsert(assignment);

    toast(error?.message || "Assignment created");

    if (!error) {
      onDone();
    }
  };

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

  const handleChangeDate = (date: Date) => {
    setStarts(date);
    setEnds(addMinutes(date, millisecondsToMinutes(duration)));
  };

  return (
    <Modal
      width="lg"
      close={closeModal}
      title="Assignment"
      content={
        <div className="">
          <Input
            Icon={<LessonsIcon size="xs" />}
            placeholder="Assignment name"
            name="title"
            onChange={(e) =>
              setAssignment((prev) => ({ ...prev, title: e.target.value }))
            }
            value={assignment.title}
          />
          <p>Description</p>
          <Editor
            setAssignmentBody={(data) =>
              setAssignment((prev) => ({ ...prev, body: JSON.stringify(data) }))
            }
            data={JSON.parse(assignment.body)}
          />
          <div className="flex gap-[14px] items-center mt-[14px]">
            <div className="pr-[12px] border-r-2 border-gray-200">
              <DateInput
                date={starts}
                onChange={handleChangeDate}
                label="Due date"
                popperPlacement="top-start"
              />
            </div>
            <button className="outline-button w-full">
              Create & add another
            </button>
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

export default AddAssignmentModal;
