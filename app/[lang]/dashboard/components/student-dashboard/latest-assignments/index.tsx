import AssignmentCard from "@/components/common/cards/assignment-card";
import type { getLatestAssignments } from "@/db/server/assignment";
import type { ResultOf } from "@/types/utils.type";
import { useTranslations } from "next-intl";
import { type FunctionComponent } from "react";

interface Props {
  assignments: ResultOf<typeof getLatestAssignments>["data"];
  onAssignmentClick: (assignmentId: string) => void;
}

const LatestAssignments: FunctionComponent<Props> = ({
  assignments,
  onAssignmentClick,
}) => {
  // Hooks
  const t = useTranslations();

  // View
  return (
    <div>
      <h2 className="font-bold text-lg">{t("dashboard.latest_assignments")}</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-4 mt-2 whitespace-nowrap pb-3">
          {!assignments.length && (
            <p className="text-neutral-500">
              {t("dashboard.your_assignments_will_show_here")}
            </p>
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
