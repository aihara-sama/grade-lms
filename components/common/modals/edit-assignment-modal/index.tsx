"use client";

import OverviewTab from "@/components/common/modals/edit-assignment-modal/tabs/overview-tab";
import SubmissionsTab from "@/components/common/modals/edit-assignment-modal/tabs/submissions-tab";
import OverviewIcon from "@/components/icons/dashboard-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";

import BasicModal from "@/components/common/modals/basic-modal";
import BasicTabs from "@/components/common/tabs/basic-tabs";
import type { FunctionComponent } from "react";

interface Props {
  assignmentId: string;
  onClose: (mutated?: boolean) => void;
  onSubmissionCreated?: () => void;
}

const ViewAssignmentModal: FunctionComponent<Props> = ({
  assignmentId,
  onClose,
  onSubmissionCreated,
}) => {
  return (
    <BasicModal width="lg" onClose={() => onClose()} title="View assignment">
      <div className="">
        <BasicTabs
          tabs={[
            {
              title: "Overview",
              Icon: <OverviewIcon />,
              content: (
                <OverviewTab
                  assignmentId={assignmentId}
                  onSubmissionCreated={onSubmissionCreated}
                  onAssignmentUpdated={() => onClose(true)}
                />
              ),
            },
            {
              title: "Submissions",
              Icon: <SubmissionsIcon />,
              content: <SubmissionsTab assignmentId={assignmentId} />,
            },
          ]}
        />
      </div>
    </BasicModal>
  );
};

export default ViewAssignmentModal;
