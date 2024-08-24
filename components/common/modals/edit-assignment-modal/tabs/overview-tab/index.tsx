import CreateSubmissionModal from "@/components/common/modals/create-submission-modal";
import DateInput from "@/components/date-input";
import Editor from "@/components/editor";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import type { Assignment } from "@/types/assignments.type";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import { useState, type FunctionComponent } from "react";

interface IProps {
  assignment: Assignment;
  onAssignmentCreatedDone: (assignment: Assignment) => void;
  onSubmissionCreated: () => void;
  user: User;
  course: Course;
  lesson: Lesson;
}

const OverviewTab: FunctionComponent<IProps> = ({
  onAssignmentCreatedDone: onDone,
  user,
  course,
  lesson,
  onSubmissionCreated,
  ...props
}) => {
  // States
  const [assignment, setAssignment] = useState<Assignment>(props.assignment);
  const [isCreateSubmissionModalOpen, setIsCreateSubmissionModalOpen] =
    useState(false);

  // Handlers
  const handleSaveAssignment = async () => {
    onDone(assignment);
  };
  const openCreateSubmissoinModal = () => setIsCreateSubmissionModalOpen(true);

  const handleChangeDate = (date: Date) => {
    setAssignment((_assignment) => ({
      ..._assignment,
      due_date: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
    }));
  };

  return (
    <div>
      <Input
        disabled={(user.user_metadata as IUserMetadata).role === Role.STUDENT}
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
          readOnly={(user.user_metadata as IUserMetadata).role === Role.STUDENT}
        />
      </div>

      <div className="flex gap-[14px] items-center mt-[14px] justify-end">
        <div className="pr-[12px] border-r-2 border-gray-200">
          <DateInput
            date={new Date(assignment.due_date)}
            onChange={handleChangeDate}
            label="Due date"
            popperPlacement="top-start"
            disabled={
              (user.user_metadata as IUserMetadata).role !== Role.TEACHER
            }
          />
        </div>
        {(user.user_metadata as IUserMetadata).role === Role.TEACHER ? (
          <button className="primary-button" onClick={handleSaveAssignment}>
            Save
          </button>
        ) : (
          <button
            className="primary-button"
            onClick={openCreateSubmissoinModal}
          >
            Create submission
          </button>
        )}
      </div>
      {(user.user_metadata as IUserMetadata).role === Role.STUDENT && (
        <CreateSubmissionModal
          user={user}
          assignmentId={assignment.id}
          course={course}
          isOpen={isCreateSubmissionModalOpen}
          setIsOpen={setIsCreateSubmissionModalOpen}
          lesson={lesson}
          onDone={onSubmissionCreated}
        />
      )}
    </div>
  );
};

export default OverviewTab;
