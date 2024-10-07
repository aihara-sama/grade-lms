import AssignmentCard from "@/components/assignment-card";
import type { getLatestAssignments } from "@/db/server/assignment";
import type { ResultOf } from "@/types/utils.type";
import { type FunctionComponent } from "react";

interface Props {
  assignments: ResultOf<typeof getLatestAssignments>["data"];
  onAssignmentClick: (assignmentId: string) => void;
}

const LatestAssignments: FunctionComponent<Props> = ({
  assignments,
  onAssignmentClick,
}) => {
  return (
    <div>
      <h2 className="font-bold text-lg">Latest assignments</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-4 mt-2 whitespace-nowrap pb-3">
          {!assignments.length && (
            <p className="text-neutral-500">Your assignments will show here</p>
          )}
          {assignments.map((assignment) => (
            <AssignmentCard
              onClick={onAssignmentClick}
              key={assignment.id}
              assignment={assignment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestAssignments;
