import DateInput from "@/components/date-input";
import Editor from "@/components/editor";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import type { Assignment } from "@/types/assignments.type";
import { format } from "date-fns";
import { useState, type FunctionComponent } from "react";

interface IProps {
  assignment: Assignment;
  onDone: (assignment: Assignment) => void;
}

const OverviewTab: FunctionComponent<IProps> = ({ onDone, ...props }) => {
  // States
  const [assignment, setAssignment] = useState<Assignment>(props.assignment);
  // Handlers
  const handleSaveAssignment = async () => {
    onDone(assignment);
  };

  const handleChangeDate = (date: Date) => {
    setAssignment((_assignment) => ({
      ..._assignment,
      due_date: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
    }));
  };

  return (
    <div>
      <Input
        fullWIdth
        Icon={<LessonsIcon size="xs" />}
        placeholder="Assignment name"
        name="title"
        value={assignment.title}
        onChange={(e) =>
          setAssignment((_assignment) => ({
            ..._assignment,
            title: e.target.value,
          }))
        }
      />
      <p>Description</p>
      <Editor
        onChange={(data) =>
          setAssignment((prev) => ({ ...prev, body: JSON.stringify(data) }))
        }
        data={JSON.parse(assignment.body)}
      />
      <div className="flex gap-[14px] items-center mt-[14px]">
        <div className="pr-[12px] border-r-2 border-gray-200">
          <DateInput
            date={new Date(assignment.due_date)}
            onChange={handleChangeDate}
            label="Due date"
            popperPlacement="top-start"
          />
        </div>

        <button className="primary-button" onClick={handleSaveAssignment}>
          Save
        </button>
      </div>
    </div>
  );
};

export default OverviewTab;
