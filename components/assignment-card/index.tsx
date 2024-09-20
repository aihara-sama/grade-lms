import CourseIcon from "@/components/icons/course-icon";
import type { Assignment } from "@/types/assignment.type";
import type { FunctionComponent } from "react";

interface Props {
  assignment: Assignment;
}

const AssignmentCard: FunctionComponent<Props> = ({ assignment }) => {
  return (
    <div
      key={assignment.id}
      className="border border-neutral-300 rounded-lg px-4 py-2 flex items-center justify-between min-w-[280px] inter-active"
    >
      <div className="flex gap-2 w-full">
        <CourseIcon size="sm" />
        <div
          className="text-sm flex-1 truncate-fade max-w-[105px] w-full font-semibold"
          title={assignment.title}
        >
          {assignment.title}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
