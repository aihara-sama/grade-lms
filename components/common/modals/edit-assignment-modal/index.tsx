"use client";

import OverviewTab from "@/components/common/modals/edit-assignment-modal/tabs/overview-tab";
import SubmissionsTab from "@/components/common/modals/edit-assignment-modal/tabs/submissions-tab";
import OverviewIcon from "@/components/icons/dashboard-icon";
import SubmissionsIcon from "@/components/icons/submissions-icon";
import Tabs from "@/components/tabs";

import BaseModal from "@/components/common/modals/base-modal";
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
    <BaseModal width="lg" onClose={() => onClose()} title="View assignment">
      <div className="">
        <Tabs
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
    </BaseModal>
  );
};

export default ViewAssignmentModal;
