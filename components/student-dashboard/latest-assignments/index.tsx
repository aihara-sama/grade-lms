import AssignmentCard from "@/components/assignment-card";
import type { Assignment } from "@/types/assignments.type";
import { type FunctionComponent } from "react";

interface IProps {
  assignments: Assignment[];
}

const LatestAssignments: FunctionComponent<IProps> = ({ assignments }) => {
  return (
    <div>
      <h2 className="font-bold text-lg">Latest assignments</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-4 mt-2 whitespace-nowrap pb-3">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestAssignments;
