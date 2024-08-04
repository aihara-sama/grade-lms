import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import type { Database } from "@/types/supabase.type";
import { useState, type FunctionComponent } from "react";

interface IProps {
  assignment: Database["public"]["Tables"]["assignments"]["Row"];
  onDone: (
    assignment: Database["public"]["Tables"]["assignments"]["Row"]
  ) => void;
}

const OverviewTab: FunctionComponent<IProps> = ({ onDone, assignment }) => {
  const [assignmentTitle, setAssignmentTitle] = useState(assignment.title);
  const handleSaveAssignment = async () => {
    onDone({
      ...assignment,
      title: assignmentTitle,
    });
  };

  return (
    <div>
      <Input
        Icon={<LessonsIcon size="sm" />}
        placeholder="Assignment name"
        name="title"
        value={assignmentTitle}
        onChange={(e) => setAssignmentTitle(e.target.value)}
      />
      <p>Description</p>
      {/* <Editor /> */}
      <div className="flex gap-[14px] items-center mt-[14px]">
        <div className="pr-[12px] border-r-2 border-gray-200">
          <DateInput date={new Date()} onChange={() => {}} label="Due date" />
        </div>

        <button className="primary-button" onClick={handleSaveAssignment}>
          Save
        </button>
      </div>
    </div>
  );
};

export default OverviewTab;
