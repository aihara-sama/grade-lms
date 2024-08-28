import CreateSubmissionModal from "@/components/common/modals/create-submission-modal";
import DateInput from "@/components/date-input";
import Editor from "@/components/editor";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import type { getAssignmentByAssignmentId } from "@/db/assignment";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { ResultOf } from "@/types";
import type { TablesUpdate } from "@/types/supabase.type";
import { format } from "date-fns";
import type { FunctionComponent } from "react";
import { useState } from "react";

interface IProps {
  assignment: ResultOf<typeof getAssignmentByAssignmentId>;
  isAssignmentPastDue: boolean;
  submitUpdateAssignment: (assignment: TablesUpdate<"assignments">) => void;
  onSubmissionCreated: () => void;
}

const OverviewTab: FunctionComponent<IProps> = ({
  submitUpdateAssignment,
  onSubmissionCreated,
  isAssignmentPastDue,
  ...props
}) => {
  // States
  const [assignment, setAssignment] = useState(props.assignment);
  const [isCreateSubmissionModalOpen, setIsCreateSubmissionModalOpen] =
    useState(false);

  // hooks
  const { user } = useUser();

  // Handlers
  const openCreateSubmissoinModal = () => setIsCreateSubmissionModalOpen(true);

  const onChangeDate = (date: Date) => {
    setAssignment((_assignment) => ({
      ..._assignment,
      due_date: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
    }));
  };

  return (
    <div>
      <Input
        disabled={user.role === Role.Student}
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
      <div className="min-h-[216px]">
        <Editor
          id="assignment-editor"
          height="sm"
          onChange={(data) =>
            setAssignment((prev) => ({ ...prev, body: JSON.stringify(data) }))
          }
          data={JSON.parse(assignment.body)}
          readOnly={user.role === Role.Student}
        />
      </div>

      <div
        className={`flex gap-[14px] items-center mt-[14px] ${isAssignmentPastDue ? "justify-between" : "justify-end"}`}
      >
        <p className="text-sm font-bold text-red-600">
          {isAssignmentPastDue && "This assignment is past due"}
        </p>
        <div className="pr-[12px] border-r-2 border-gray-200">
          <DateInput
            date={new Date(assignment.due_date)}
            onChange={onChangeDate}
            label="Due date"
            popperPlacement="top-start"
            disabled={user.role !== Role.Teacher}
          />
        </div>
        {user.role === Role.Teacher ? (
          <button
            className="primary-button"
            onClick={() =>
              submitUpdateAssignment({
                body: assignment.body,
                title: assignment.title,
                due_date: assignment.due_date,
                id: assignment.id,
              })
            }
          >
            Save
          </button>
        ) : (
          <button
            disabled={isAssignmentPastDue}
            className="primary-button"
            onClick={openCreateSubmissoinModal}
          >
            Create submission
          </button>
        )}
      </div>
      {user.role === Role.Student && (
        <CreateSubmissionModal
          isOpen={isCreateSubmissionModalOpen}
          setIsOpen={setIsCreateSubmissionModalOpen}
          assignmentId={assignment.id}
          lessonId={assignment.lesson_id}
          courseId={assignment.lesson.course_id}
          onDone={onSubmissionCreated}
        />
      )}
    </div>
  );
};
export default OverviewTab;
