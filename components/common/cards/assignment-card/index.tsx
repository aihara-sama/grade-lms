import CourseIcon from "@/components/icons/course-icon";
import type { getLatestAssignments } from "@/db/server/assignment";
import type { ResultOf } from "@/types/utils.type";
import type { FunctionComponent } from "react";

interface Props {
  assignment: ResultOf<typeof getLatestAssignments>["data"][number];
  onClick: (assignmentId: string) => void;
}

const AssignmentCard: FunctionComponent<Props> = ({ assignment, onClick }) => {
  return (
    <div
      onClick={() => onClick(assignment.id)}
      key={assignment.id}
      className="border border-neutral-300 rounded-lg px-4 py-2 flex items-center justify-between min-w-[280px] inter-active"
    >
      <div className="flex gap-2 w-full">
        <CourseIcon size="sm" />
        <div
          className="text-sm flex-1 truncate-fade max-w-[218px] w-full font-semibold"
          title={assignment.title}
        >
          {assignment.title}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
